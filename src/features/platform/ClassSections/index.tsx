"use client";
import React, { useState, useMemo } from "react";
import AnalysisCard from "@/common/components/shared/AnalysisCard";
import { useHeader } from "@/hooks/useHeader";
import { DataTable, DeleteConfirmDialog, FilterBar, Modal } from "@/common/components/shared";
import { useClassWithSections, useAcademicYear, useClass, useEnrollment, AcademicYear } from "./services/ClassService";
import { useCurrentAcademicYear } from "@/hooks/useCurrentAcademicYear";
import { classColumns, dashStats, headerConfig, classFilterConfigs, ClassWithSections } from "./constant/CONFIG_DATA";
import { ClassForm } from "./components/ClassForm";
import { EditClassForm } from "./components/EditClassForm";
import { ManageSectionsForm } from "./components/ManageSectionsForm";
import { ClassBulkImporter } from "./components/ClassBulkImporter";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const ClassesPage = () => {
  const [page, setPage] = useState(1);
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [isBulkImportModalOpen, setIsBulkImportModalOpen] = useState(false);
  const [isEditClassFormOpen, setIsEditClassFormOpen] = useState(false);
  const [isManageSectionsFormOpen, setIsManageSectionsFormOpen] = useState(false);
  const [isManageStudentsOpen, setIsManageStudentsOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassWithSections | null>(null);
  const [actionType, setActionType] = useState<string | null>(null);
  
  const [filters, setFilters] = useState({
    search: "",
    academicYearId: "",
  });

  const pageSize = 10;
  const queryClient = useQueryClient();
  const deleteClass = useClass.useRemove();
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const { academicYear: currentAcademicYear } = useCurrentAcademicYear();
  const { data: academicYears = [] } = useAcademicYear.useData();
  const fallbackAcademicYearId = academicYears.find((year) => year.isCurrent)?.id;
  const selectedAcademicYearId = filters.academicYearId || currentAcademicYear?.id || fallbackAcademicYearId || "";
  const canManageSections = Boolean(currentAcademicYear?.id && selectedAcademicYearId === currentAcademicYear.id);
  const manageSectionsDisabledReason = currentAcademicYear?.name
    ? `You can only manage sections for the current academic year. Switch back to ${currentAcademicYear.name} to continue.`
    : "You can only manage sections for the current academic year.";
  const { data: enrollments = [] } = useEnrollment.useData();
  const { data: classesData = [], isLoading, isFetching } = useClassWithSections.useData();

  // Map sectionId to classId for easier lookup
  const sectionToClassMap = useMemo(() => {
    const map = new Map<string, string>();
    classesData.forEach((cls) => {
      cls.sections.forEach((sec) => {
        map.set(sec.id, cls.id);
      });
    });
    return map;
  }, [classesData]);

  // Count enrolled students per class
  const enrollmentsByClass = useMemo(() => {
    const counts = new Map<string, number>();
    enrollments.forEach((enrollment) => {
      const sectionId = enrollment.sectionId || enrollment.section?.id;
      const classId = enrollment.classId || enrollment.section?.classId || (sectionId ? sectionToClassMap.get(sectionId) : undefined);
      if (classId) {
        counts.set(classId, (counts.get(classId) || 0) + 1);
      }
    });
    return counts;
  }, [enrollments, sectionToClassMap]);

  React.useEffect(() => {
    if (!filters.academicYearId && selectedAcademicYearId) {
      setFilters((prev) => ({
        ...prev,
        academicYearId: selectedAcademicYearId,
      }));
    }
  }, [filters.academicYearId, selectedAcademicYearId]);

  // Invalidate query cache when academic year changes to ensure fresh data
  React.useEffect(() => {
    if (selectedAcademicYearId) {
      queryClient.invalidateQueries({
        queryKey: ['classes', 'with-sections'],
      });
    }
  }, [selectedAcademicYearId, queryClient]);

  // Filter and paginate data
  const filteredData = useMemo(() => {
    let result = classesData;

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (cls) =>
          cls.name.toLowerCase().includes(searchLower) ||
          (cls.numericLevel?.toString() || "").includes(searchLower) ||
          cls.description?.toLowerCase().includes(searchLower)
      );
    }

    return result;
  }, [classesData, filters.search]);

  const paginatedData = filteredData.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const handleFilterChange = (id: string, val: string) => {
    if (id === "academicYearId") {
      setFilters((prev) => ({
        ...prev,
        academicYearId: val,
      }));
      // Invalidate cache to force re-fetch for new academic year
      queryClient.invalidateQueries({
        queryKey: ['classes', 'with-sections'],
      });
    } else {
      setFilters((prev) => ({ ...prev, [id]: val }));
    }
    setPage(1);
  };

  useHeader(headerConfig, (eventName) => {
    if (eventName === "CLASS_BULK_IMPORT") setIsBulkImportModalOpen(true);
    if (eventName === "CLASS_CREATE") setIsClassModalOpen(true);
  });

  // Handle action menu clicks - receives row data directly from ActionMenu
  const handleActionClick = (action: string, classId: string, rowData?: ClassWithSections) => {
    const selectedRowData = rowData || 
      paginatedData.find((cls) => cls.id === classId);
    
    if (!selectedRowData) return;

    if (action === "manage-sections" && !canManageSections) {
      toast.error(manageSectionsDisabledReason);
      return;
    }

    switch (action) {
      case 'edit':
        setSelectedClass(selectedRowData as ClassWithSections);
        setActionType('edit');
        setIsEditClassFormOpen(true);
        break;
      case 'manage-sections':
        setSelectedClass(selectedRowData as ClassWithSections);
        setActionType('manage-sections');
        setIsManageSectionsFormOpen(true);
        break;
      case 'manage-students':
        setSelectedClass(selectedRowData as ClassWithSections);
        setActionType('manage-students');
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
    // Filter sections by selected academic year
    const filteredSections = cls.sections.filter(
      (sec) => sec.academicYearId === selectedAcademicYearId
    );
    
    const enrolledCount = enrollmentsByClass.get(cls.id) || 0;
    
    return {
      ...cls,
      sections: filteredSections,
      enrollment: enrolledCount.toString(),
      classTeacher: "TBD",
      status: "active",
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
      await queryClient.refetchQueries({ queryKey: ["classes-with-sections"] });
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
          total={filteredData.length}
          page={page}
          pageSize={pageSize}
          onPageChange={(newPage) => setPage(newPage)}
          isLoading={isLoading || isFetching}
          emptyMessage="No classes found."
        />
      </div>

      {/* Create/Edit Class Modal */}
      <Modal
        isOpen={isClassModalOpen && actionType !== "edit"}
        onClose={() => {
          setIsClassModalOpen(false);
          setSelectedClass(null);
          setActionType(null);
        }}
        title="Create New Class"
        className="max-w-3xl"
      >
        <div className="max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
          <ClassForm
            onCancel={() => {
              setIsClassModalOpen(false);
              setSelectedClass(null);
              setActionType(null);
            }}
            onSuccess={() => {
              setIsClassModalOpen(false);
              setSelectedClass(null);
              setActionType(null);
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
            setActionType(null);
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
                setActionType(null);
              }}
              onSuccess={() => {
                setIsEditClassFormOpen(false);
                setSelectedClass(null);
                setActionType(null);
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
            setActionType(null);
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
                setActionType(null);
              }}
              onSuccess={() => {
                setIsManageSectionsFormOpen(false);
                setSelectedClass(null);
                setActionType(null);
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
            setActionType(null);
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
