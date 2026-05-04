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

// export const manageSectionsFormSteps = [
//   { id: 0, title: "Sections", sections: ["sections"] },
// ];

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

  const handleSubmit = async (formData: ManageSectionsFormValues) => {
    try {
      setIsUpdating(true);

      const submitted = (formData.sections || []).filter(
        (section) => section.id || (section.name && section.name.trim()),
      );

      if (!submitted.length) {
        toast.error("Please add at least one section");
        setIsUpdating(false);
        return;
      }

      const sectionNames = submitted
        .filter((section): section is SectionFormValue & { name: string } => Boolean(section.name && section.name.trim()))
        .map((section) => section.name.trim().toLowerCase());

      const uniqueNames = new Set(sectionNames);
      if (uniqueNames.size !== sectionNames.length) {
        toast.error("Section names must be unique. You have duplicate section names.");
        setIsUpdating(false);
        return;
      }

      const originalIds = initialSections.map((section) => section.id);
      const submittedIds = submitted.filter((section) => section.id).map((section) => section.id as string);

      const toDelete = originalIds.filter((id) => !submittedIds.includes(id));
      const toUpdate = submitted.filter((section) => section.id);
      const toCreate = submitted.filter((section) => !section.id && section.name && section.name.trim());

      const errors: string[] = [];

      for (const id of toDelete) {
        try {
          await deleteSection.mutateAsync(id);
        } catch (error: unknown) {
          const sectionError = error as ApiError;
          const errMsg = sectionError.response?.data?.message || sectionError.message || "Delete failed";
          errors.push(`Delete failed: ${errMsg}`);
        }
      }

      for (const section of toUpdate) {
        try {
          if (!section.name || !section.name.trim()) {
            throw new Error("Section name cannot be empty");
          }

          const payload: {
            name: string;
            capacity: number;
            classTeacherId?: string;
          } = {
            name: section.name.trim(),
            capacity: Number.parseInt(String(section.capacity), 10) || 40,
          };

          if (section.classTeacherId && typeof section.classTeacherId === "string" && section.classTeacherId.trim()) {
            payload.classTeacherId = section.classTeacherId.trim();
          }

          await updateSection.mutateAsync({ id: section.id as string, data: payload });
        } catch (error: unknown) {
          const sectionError = error as ApiError;
          const errMsg = sectionError.response?.data?.message || sectionError.message || "Update failed";
          errors.push(`Update "${section.name}" failed: ${errMsg}`);
        }
      }

      for (const section of toCreate) {
        try {
          if (!section.name || !section.name.trim()) {
            throw new Error("Section name cannot be empty");
          }

          let academicYearId = section.academicYearId;
          if (!academicYearId) {
            if (classData.sections[0]?.academicYearId) {
              academicYearId = classData.sections[0].academicYearId;
            } else if (currentAcademicYearId) {
              academicYearId = currentAcademicYearId;
            }
          }

          if (!academicYearId) {
            throw new Error("Unable to determine academic year for new section");
          }

          const payload: {
            name: string;
            classId: string;
            academicYearId: string;
            capacity: number;
            classTeacherId?: string;
          } = {
            name: section.name.trim(),
            classId: classData.id,
            academicYearId,
            capacity: Number.parseInt(String(section.capacity), 10) || 40,
          };

          if (section.classTeacherId && typeof section.classTeacherId === "string" && section.classTeacherId.trim()) {
            payload.classTeacherId = section.classTeacherId.trim();
          }

          await createSection.mutateAsync(payload);
        } catch (error: unknown) {
          const sectionError = error as ApiError;
          const errMsg = sectionError.response?.data?.message || sectionError.message || "Creation failed";
          errors.push(`Create "${section.name}" failed: ${errMsg}`);
        }
      }

      if (errors.length > 0) {
        toast.error(errors[0]);
        setIsUpdating(false);
        return;
      }

      toast.success("Sections saved successfully!");
      onSuccess();
      onClose();
      void queryClient.refetchQueries({ queryKey: ["classes-with-sections"] });
    } catch (error: unknown) {
      const sectionError = error as ApiError;
      const errMsg = sectionError.response?.data?.message || sectionError.message || "Failed to save sections";
      toast.error(errMsg);
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