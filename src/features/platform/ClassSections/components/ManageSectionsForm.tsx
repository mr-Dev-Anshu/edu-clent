"use client";
import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { MultiStepFormEngine } from "@/common/components/shared/MultiStepFormEngine";
import { ClassWithSections, useSection } from "../services/ClassService";
import { useCurrentAcademicYear } from "@/hooks/useCurrentAcademicYear";
import { sectionFormConfig } from "../constant/CONFIG_DATA";

type SectionFormValue = {
  id?: string;
  name?: string;
  capacity?: number | string;
  classTeacherId?: string | null;
  academicYearId?: string | null;
};

type ManageSectionsFormValues = {
  sections: SectionFormValue[];
};

type ApiError = {
  response?: { data?: { message?: string } };
  message?: string;
};

export const manageSectionsFormSteps = [
  { id: 0, title: "Organization", sections: ["step2_details", "sections"] },
];

export const ManageSectionsForm = ({
  classData,
  onClose,
  onSuccess,
}: {
  classData: ClassWithSections;
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const queryClient = useQueryClient();
  const { academicYear } = useCurrentAcademicYear();
  const currentAcademicYearId = academicYear?.id;
  
  const createSection = useSection.useCreate();
  const updateSection = useSection.useUpdate();
  const deleteSection = useSection.useRemove();
  
  // Only manage sections for the current academic year in this form
  const initialSections = classData.sections.filter(
    (s) => s.academicYearId === currentAcademicYearId
  );

  // Helper: Get academic year ID for new section
  const getAcademicYearId = (section: SectionFormValue): string => {
    return section.academicYearId || classData.sections[0]?.academicYearId || currentAcademicYearId || "";
  };

  // Helper: Build section payload (update or create)
  const buildSectionPayload = (section: SectionFormValue, includeClassId = false) => ({
    name: section.name?.trim() || "",
    capacity: Number.parseInt(String(section.capacity), 10) || 40,
    ...(section.classTeacherId?.toString().trim() && { classTeacherId: section.classTeacherId.toString().trim() }),
    ...(includeClassId && { classId: classData.id, academicYearId: getAcademicYearId(section) }),
  });

  // Helper: Execute operation with error handling
  const executeOperation = async (
    operation: () => Promise<unknown>,
    errorPrefix: string,
    sectionName?: string
  ): Promise<string | null> => {
    try {
      await operation();
      return null;
    } catch (error: unknown) {
      const err = error as ApiError;
      const msg = err.response?.data?.message || err.message || "Failed";
      return `${errorPrefix}: ${msg}${sectionName ? ` ("${sectionName}")` : ""}`;
    }
  };

  const handleSubmit = async (formData: ManageSectionsFormValues) => {
    try {
      setIsUpdating(true);

      const submitted = (formData.sections || []).filter(
        (section) => section.id || (section.name && section.name.trim()),
      );

      // Check for duplicate names
      const sectionNames = submitted
        .filter((s): s is SectionFormValue & { name: string } => Boolean(s.name?.trim()))
        .map((s) => s.name.toLowerCase());

      if (new Set(sectionNames).size !== sectionNames.length) {
        toast.error("Section names must be unique.");
        return;
      }

      const errors: (string | null)[] = [];
      const originalIds = initialSections.map((s) => s.id);
      const submittedIds = submitted.filter((s) => s.id).map((s) => s.id as string);

      // Delete removed sections
      for (const id of originalIds.filter((id) => !submittedIds.includes(id))) {
        const err = await executeOperation(() => deleteSection.mutateAsync(id), "Delete failed");
        if (err) errors.push(err);
      }

      // Update existing sections
      for (const section of submitted.filter((s) => s.id)) {
        if (!section.name?.trim()) {
          errors.push("Section name cannot be empty");
          continue;
        }
        const err = await executeOperation(
          () => updateSection.mutateAsync({ id: section.id as string, data: buildSectionPayload(section) }),
          "Update failed",
          section.name
        );
        if (err) errors.push(err);
      }

      // Create new sections
      for (const section of submitted.filter((s) => !s.id && s.name?.trim())) {
        const academicYearId = getAcademicYearId(section);
        if (!academicYearId) {
          errors.push("Unable to determine academic year");
          continue;
        }
        const payload = { ...buildSectionPayload(section, true), academicYearId };
        const err = await executeOperation(
          () => createSection.mutateAsync(payload),
          "Create failed",
          section.name
        );
        if (err) errors.push(err);
      }

      if (errors.length > 0) {
        toast.error(errors[0] || "Operation failed");
        setIsUpdating(false);
        return;
      }

      toast.success("Sections saved successfully!");
      onSuccess();
      onClose();
      
      // Refresh queries
      void queryClient.refetchQueries({ queryKey: ["sections"] });
      void queryClient.refetchQueries({ queryKey: ["classes-with-sections"] });
      void queryClient.refetchQueries({ queryKey: [`class-sections-${classData.id}`], exact: false });
    } catch (error: unknown) {
      const err = error as ApiError;
      toast.error(err.response?.data?.message || err.message || "Failed to save sections");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="relative">
      {isUpdating && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-50 flex items-center justify-center rounded-b-2xl">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-[11px] font-black uppercase tracking-widest text-slate-700">Saving Sections...</p>
          </div>
        </div>
      )}

      <MultiStepFormEngine
        steps={manageSectionsFormSteps}
        formConfig={sectionFormConfig}
        onCancel={onClose}
        onSubmit={handleSubmit}
        submitButtonText={isUpdating ? "Saving..." : "Save Changes"}
        defaultValues={{
            sections: initialSections.map((section) => ({
              id: section.id,
              name: section.name,
              capacity: section.capacity,
              classTeacherId: section.classTeacherId || null,
              academicYearId: section.academicYearId,
            })),
          }}
      />
    </div>
  );
};