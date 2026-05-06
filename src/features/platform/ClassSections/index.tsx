"use client";
import React, { useState } from "react";
import AnalysisCard from "@/common/components/shared/AnalysisCard";
import { useHeader } from "@/hooks/useHeader";
import { useRouter } from "next/navigation";
import { DataTable, DeleteConfirmDialog, FilterBar, Modal } from "@/common/components/shared";
import { useClassWithSections, useAcademicYear, useClass, AcademicYear, PaginatedResponse } from "./services/ClassService";
import { useCurrentAcademicYear } from "@/hooks/useCurrentAcademicYear";
import { classColumns, dashStats, headerConfig, classFilterConfigs, ClassWithSections } from "./constant/CONFIG_DATA";
import { ClassForm } from "./components/ClassForm";
import { EditClassForm } from "./components/EditClassForm";
import { ManageSectionsForm } from "./components/ManageSectionsForm";
import { ClassBulkImporter } from "./components/ClassBulkImporter";
import { toast } from "sonner";

const ClassesPage = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [isBulkImportModalOpen, setIsBulkImportModalOpen] = useState(false);
  const [isEditClassFormOpen, setIsEditClassFormOpen] = useState(false);
  const [isManageSectionsFormOpen, setIsManageSectionsFormOpen] = useState(false);
  const [isManageStudentsOpen, setIsManageStudentsOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassWithSections | null>(null);
  
  const [filters, setFilters] = useState({
    search: "",
    academicYearId: "",
  });

  const pageSize = 10;
  const deleteClass = useClass.useRemove();
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const { academicYear: currentAcademicYear } = useCurrentAcademicYear();
  const { data: academicYears = [] } = useAcademicYear.useData();
  const fallbackAcademicYearId = academicYears.find((year) => year.isCurrent)?.id;
  const selectedAcademicYearId = filters.academicYearId || currentAcademicYear?.id || fallbackAcademicYearId || "";
  const canManageSections = Boolean(currentAcademicYear?.id && selectedAcademicYearId === currentAcademicYear.id);
  const selectedAcademicYearName = academicYears.find((year) => year.id === selectedAcademicYearId)?.name;
  const manageSectionsDisabledReason = currentAcademicYear?.name
    ? `You can only manage sections for the current academic year. Switch back to ${currentAcademicYear.name} to continue.`
    : "You can only manage sections for the current academic year.";

  // Prepare filters for backend
  const backendFilters = {
    ...(filters.search && { search: filters.search }),
    ...(selectedAcademicYearId && { academicYearId: selectedAcademicYearId }),
  };

  // Fetch paginated data from backend
  const { data: classesResponse = {} as PaginatedResponse<ClassWithSections>, isLoading, isFetching } = useClassWithSections.usePaginatedData(
    page,
    pageSize,
    backendFilters
  );

  const paginatedData = classesResponse?.data || [];
  const total = classesResponse?.total || 0;

  const handleFilterChange = (id: string, val: string) => {
    setFilters((prev) => ({ ...prev, [id]: val }));
    setPage(1);
  };

  useHeader(headerConfig, (eventName) => {
    if (eventName === "CLASS_BULK_IMPORT") setIsBulkImportModalOpen(true);
    if (eventName === "CLASS_CREATE") setIsClassModalOpen(true);
  });

  // Handle action menu clicks - receives row data directly from ActionMenu
  const handleActionClick = (action: string, classId: string, rowData?: ClassWithSections) => {
    const selectedRowData = rowData || 
      paginatedData.find((cls: ClassWithSections) => cls.id === classId);
    
    if (!selectedRowData) return;

    if (action === "manage-sections" && !canManageSections) {
      toast.error(manageSectionsDisabledReason);
      return;
    }

    switch (action) {
      case 'view': {
        const params = new URLSearchParams({
          classId: selectedRowData.id,
          academicYearId: selectedAcademicYearId,
          className: selectedRowData.name,
          academicYearName:
            selectedRowData.sections?.[0]?.academicYear?.name ||
            selectedAcademicYearName ||
            "",
          totalEnrollment: String(selectedRowData.totalEnrollment ?? 0),
        });
        router.push(`/platform/classes/sections?${params.toString()}`);
        break;
      }
      case 'edit':
        setSelectedClass(selectedRowData as ClassWithSections);
        setIsEditClassFormOpen(true);
        break;
      case 'manage-sections':
        setSelectedClass(selectedRowData as ClassWithSections);
        setIsManageSectionsFormOpen(true);
        break;
      case 'manage-students':
        setSelectedClass(selectedRowData as ClassWithSections);
        setIsManageStudentsOpen(true);
        break;
      case 'delete':
        setSelectedClass(selectedRowData as ClassWithSections);
        setIsDeleteConfirmOpen(true);
        break;
    }
  };

  // Transform data for table display
  const tableData = paginatedData.map((cls: ClassWithSections) => {
    return {
      ...cls,
      enrollment: String(cls.totalEnrollment ?? 0),
      classTeacher: "TBD",
      onActionClick: handleActionClick,
      canManageSections,
      manageSectionsDisabledReason,
      onManageSectionsDisabledClick: () => {
        toast.error(manageSectionsDisabledReason);
      },
    };
  });

  const handleDeleteConfirm = async () => {
    if (!selectedClass) return;

    try {
      await deleteClass.mutateAsync(selectedClass.id);
      toast.success("Class deleted successfully");
      setIsDeleteConfirmOpen(false);
      setSelectedClass(null);
    } catch (error: unknown) {
      const message =
        typeof error === "object" && error !== null && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      toast.error(message || "Failed to delete class");
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteConfirmOpen(false);
    setSelectedClass(null);
  };

  // Update filterConfigs with dynamic academic years
  const updatedFilterConfigs = classFilterConfigs.map((config) => {
    if (config.id === "academicYearId") {
      return {
        ...config,
        value: selectedAcademicYearId,
        options: [
          ...academicYears.map((year: AcademicYear) => ({
            label: year.name,
            value: year.id,
          })),
        ],
      };
    }
    return config;
  });

  return (
    <div className="space-y-6 p-6">
      {/* Filters */}
      <FilterBar
        configs={updatedFilterConfigs}
        onFilterChange={handleFilterChange}
        showApplyButton={false}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashStats.map((stat) => (
          <AnalysisCard key={stat.id} {...stat} />
        ))}
      </div>

      {/* Table */}
      <div>
        <DataTable
          data={tableData}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          columns={classColumns as any}
          total={total}
          page={page}
          pageSize={pageSize}
          onPageChange={(newPage) => setPage(newPage)}
          isLoading={isLoading || isFetching}
          emptyMessage="No classes found."
        />
      </div>

      {/* Create/Edit Class Modal */}
      <Modal
        isOpen={isClassModalOpen && !isEditClassFormOpen}
        onClose={() => {
          setIsClassModalOpen(false);
          setSelectedClass(null);
        }}
        title="Create New Class"
        className="max-w-3xl"
      >
        <div className="max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
          <ClassForm
            onCancel={() => {
              setIsClassModalOpen(false);
              setSelectedClass(null);
            }}
            onSuccess={() => {
              setIsClassModalOpen(false);
              setSelectedClass(null);
            }}
          />
        </div>
      </Modal>

      {/* Bulk Import Modal */}
      <Modal
        isOpen={isBulkImportModalOpen}
        onClose={() => setIsBulkImportModalOpen(false)}
        title="Bulk Import Classes"
        className="max-w-2xl"
      >
        <div className="max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
          <ClassBulkImporter
            onCancel={() => setIsBulkImportModalOpen(false)}
            onSuccess={() => setIsBulkImportModalOpen(false)}
          />
        </div>
      </Modal>

      <DeleteConfirmDialog
        isOpen={isDeleteConfirmOpen}
        title="Delete Class"
        description={`Are you sure you want to delete "${selectedClass?.name}"? This action cannot be undone and will affect all related sections and enrollments.`}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        isPending={deleteClass.isPending}
      />

      {/* Edit Class Form */}
      {isEditClassFormOpen && selectedClass && (
        <Modal
          isOpen={isEditClassFormOpen}
          onClose={() => {
            setIsEditClassFormOpen(false);
            setSelectedClass(null);
          }}
          title="Edit Class"
          className="max-w-3xl"
        >
          <div className="max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
            <EditClassForm
              classData={selectedClass}
              onClose={() => {
                setIsEditClassFormOpen(false);
                setSelectedClass(null);
              }}
              onSuccess={() => {
                setIsEditClassFormOpen(false);
                setSelectedClass(null);
              }}
            />
          </div>
        </Modal>
      )}

      {/* Manage Sections Form */}
      {isManageSectionsFormOpen && selectedClass && (
        <Modal
          isOpen={isManageSectionsFormOpen}
          onClose={() => {
            setIsManageSectionsFormOpen(false);
            setSelectedClass(null);

          }}
          title="Manage Sections"
          className="max-w-3xl"
        >
          <div className="max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
            <ManageSectionsForm
              classData={selectedClass}
              onClose={() => {
                setIsManageSectionsFormOpen(false);
                setSelectedClass(null);
              }}
              onSuccess={() => {
                setIsManageSectionsFormOpen(false);
                setSelectedClass(null);
              }}
            />
          </div>
        </Modal>
      )}

      {/* Manage Students Modal */}
      {isManageStudentsOpen && selectedClass && (
        <Modal
          isOpen={isManageStudentsOpen}
          onClose={() => {
            setIsManageStudentsOpen(false);
            setSelectedClass(null);
          }}
          title="Manage Students"
          className="max-w-4xl"
        >
          <div className="max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar p-6">
            <div className="text-center text-slate-600">
              <p className="font-medium">Manage Students for {selectedClass.name}</p>
              <p className="text-sm text-slate-400 mt-2">Student management interface coming soon</p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ClassesPage;
