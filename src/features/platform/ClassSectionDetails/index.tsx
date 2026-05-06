"use client";

import React, { useState } from "react";
import { SectionHeader } from "./components/SectionHeader";
import { useQueryClient } from "@tanstack/react-query";
import {
  DataTable,
  EmptyState,
  FilterBar,
  Modal,
  DeleteConfirmDialog,
} from "@/common/components/shared";
import { useRouter, useSearchParams } from "next/navigation";
import { useHeader } from "@/hooks/useHeader";
import { useCurrentAcademicYear } from "@/hooks/useCurrentAcademicYear";
import { ManageSectionForm } from "./components/ManageSectionForm";
import { ManageSectionsForm } from "../ClassSections/components/ManageSectionsForm";
import {
  useSection,
  type Section,
  type ClassWithSections,
} from "../ClassSections/services/ClassService";
import { toast } from "sonner";
import {
  sectionColumns,
  sectionFilterConfigs,
  sectionHeaderConfig,
  SectionTableRow,
} from "./constant/CONFIG_DATA";
import { useClassSectionsPaginated } from "./services/ClassSectionDetailsService";

const ClassSectionDetailsPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const classId = searchParams.get("classId") || "";
  const queryAcademicYearId = searchParams.get("academicYearId") || "";
  const queryClassName = searchParams.get("className") || "";
  const queryAcademicYearName = searchParams.get("academicYearName") || "";
  const queryTotalEnrollment = Number(searchParams.get("totalEnrollment") || "0");

  const [page, setPage] = useState(1);
  const [isManageSectionsOpen, setIsManageSectionsOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const [filters, setFilters] = useState({ search: "" });

  const pageSize = 10;
  const { academicYear: currentAcademicYear } = useCurrentAcademicYear();
  const deleteSection = useSection.useRemove();
  const selectedAcademicYearId = queryAcademicYearId || currentAcademicYear?.id || "";
  
  const canManageSections = Boolean(
    currentAcademicYear?.id && selectedAcademicYearId === currentAcademicYear.id
  );
  const manageSectionsDisabledReason = currentAcademicYear?.name
    ? `You can only manage sections for the current academic year. Switch back to ${currentAcademicYear.name} to continue.`
    : "You can only manage sections for the current academic year.";

  const listFilters = {
    ...(selectedAcademicYearId && { academicYearId: selectedAcademicYearId }),
    ...(filters.search && { search: filters.search }),
  };

  const {
    data: sectionsResponse,
    isLoading,
    isFetching,
    refetch: refetchSections,
  } = useClassSectionsPaginated(classId, page, pageSize, listFilters);

  const sections = sectionsResponse?.data || [];
  const className = queryClassName || "Class";
  const academicYearName = queryAcademicYearName || currentAcademicYear?.name || "Academic Year";
  const isCurrentAcademicYear = Boolean(
    currentAcademicYear?.id === selectedAcademicYearId || currentAcademicYear?.isCurrent
  );

  // Handlers
  const resetModalState = () => {
    setIsManageSectionsOpen(false);
    setSelectedSection(null);
    setIsAddMode(false);
  };

  const handleSectionsUpdated = async () => {
    await Promise.all([
      refetchSections(),
      queryClient.refetchQueries({ queryKey: ["classes-with-sections"] }),
    ]);
    resetModalState();
  };

  const handleFilterChange = (id: string, value: string) => {
    setFilters((prev) => ({ ...prev, [id]: value }));
    setPage(1);
  };

  // Setup header with Add Section button
  const headerConfig = {
    ...sectionHeaderConfig,
    actions: sectionHeaderConfig.actions.map((action) => ({
      ...action,
      disabled: !canManageSections,
      disabledReason: manageSectionsDisabledReason,
    })),
  };

  useHeader(headerConfig, (eventName) => {
    if (eventName === "SECTION_ADD") {
      setSelectedSection(null);
      setIsAddMode(true);
      setIsManageSectionsOpen(true);
    }
  });

  const handleActionClick = (action: string, sectionId?: string) => {
    const target = sections.find((s) => s.id === sectionId);
    
    switch (action) {
      case "manage-sections":
        setSelectedSection(target || null);
        setIsAddMode(false);
        setIsManageSectionsOpen(true);
        break;
      case "view-students":
        if (target && sectionId) {
          const params = new URLSearchParams({
            classId,
            className,
            sectionId,
            sectionName: target.name,
            academicYearId: selectedAcademicYearId,
            academicYearName,
          });
          router.push(`/platform/classes/enrollments?${params.toString()}`);
        }
        break;
      case "delete-section":
        setSelectedSection(target || null);
        setIsDeleteConfirmOpen(true);
        break;
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedSection) return;
    try {
      await deleteSection.mutateAsync(selectedSection.id);
      toast.success("Section deleted successfully");
      setIsDeleteConfirmOpen(false);
      await handleSectionsUpdated();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      toast.error(err.response?.data?.message || err.message || "Failed to delete section");
    }
  };

  const tableData: SectionTableRow[] = sections.map((section) => ({
    ...section,
    enrollment: String(section.enrolledCount ?? 0),
    classTeacherName: section.classTeacher
      ? `${section.classTeacher.firstName} ${section.classTeacher.lastName}`
      : "Not Assigned",
    canManageSections,
    manageSectionsDisabledReason,
    onManageSectionsDisabledClick: () => toast.error(manageSectionsDisabledReason),
    onActionClick: handleActionClick,
  }));

  if (!classId) {
    return (
      <div className="p-6">
        <EmptyState
          title="Class not selected"
          description="Open this page from Classes table using View Details action."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <SectionHeader
            className={className}
            academicYearName={academicYearName}
            isCurrentAcademicYear={isCurrentAcademicYear}
          />

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-slate-50 px-4 py-3 border border-slate-200 min-w-35">
              <p className="text-[11px] uppercase tracking-wide text-slate-500 font-semibold">Total Sections</p>
              <p className="text-lg font-bold text-slate-900">{sectionsResponse?.total ?? 0}</p>
            </div>
            <div className="rounded-lg bg-slate-50 px-4 py-3 border border-slate-200 min-w-40">
              <p className="text-[11px] uppercase tracking-wide text-slate-500 font-semibold">Total Enrollment</p>
              <p className="text-lg font-bold text-slate-900">{queryTotalEnrollment}</p>
            </div>
          </div>
        </div>
      </div>

      <FilterBar
        configs={sectionFilterConfigs}
        onFilterChange={handleFilterChange}
        showApplyButton={false}
      />

      <DataTable
        data={tableData}
        columns={sectionColumns}
        total={sectionsResponse?.total || 0}
        page={page}
        pageSize={pageSize}
        onPageChange={(newPage) => setPage(newPage)}
        isLoading={isLoading || isFetching}
        emptyMessage="No sections found."
      />

      {classId && (
        <Modal
          isOpen={isManageSectionsOpen}
          onClose={resetModalState}
          title={isAddMode ? "Add Section" : "Manage Section"}
          className="max-w-3xl"
        >
          <div className="max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
            {isAddMode ? (
              <ManageSectionsForm
                classData={{ id: classId, sections: [], name: "", numericLevel: 0, tenantId: "", createdAt: "", updatedAt: "" } as ClassWithSections}
                onClose={resetModalState}
                onSuccess={handleSectionsUpdated}
              />
            ) : selectedSection ? (
              <ManageSectionForm
                sectionData={selectedSection}
                onClose={resetModalState}
                onSuccess={handleSectionsUpdated}
              />
            ) : null}
          </div>
        </Modal>
      )}

      <DeleteConfirmDialog
        isOpen={isDeleteConfirmOpen}
        title="Delete Section"
        description={`Are you sure you want to delete "${selectedSection?.name || "this section"}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setIsDeleteConfirmOpen(false);
          setSelectedSection(null);
        }}
        isPending={deleteSection.isPending}
      />
    </div>
  );
};

export default ClassSectionDetailsPage;
