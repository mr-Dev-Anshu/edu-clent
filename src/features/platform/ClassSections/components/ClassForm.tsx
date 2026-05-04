"use client";
import { MultiStepFormEngine } from "@/common/components/shared/MultiStepFormEngine";
import { classFormConfig, classSectionsSectionConfig } from "../constant/CONFIG_DATA";
import { useClass, useSection } from "../services/ClassService";
import { useCurrentAcademicYear } from "@/hooks/useCurrentAcademicYear";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import React, { useState } from "react";

type ClassFormProps = {
  onCancel: () => void;
  onSuccess?: () => void;
};

type SectionFormInput = {
  name?: string;
  capacity?: number | string;
  classTeacherId?: string | null;
};

type ClassFormValues = {
  name: string;
  numericLevel: string | number;
  description?: string;
  sections?: SectionFormInput[];
};

type CreatedClassResponse = {
  data?: { id?: string };
  id?: string;
};

type SectionCreateResult =
  | { success: true }
  | { success: false; error: unknown };

type ApiError = {
  response?: { data?: { message?: string } };
  message?: string;
};

export const classFormSteps = [
  { id: 0, title: "Class Details", sections: ["step1"] },
  { id: 1, title: "Sections", sections: ["step2_details", "sections"] },
];

export const ClassForm = ({ onCancel, onSuccess }: ClassFormProps) => {
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);

  const createClass = useClass.useCreate();
  const createSection = useSection.useCreate();
  const { academicYear: currentAcademicYear } = useCurrentAcademicYear();

  const handleFormSubmit = async (data: ClassFormValues) => {
    try {
      setIsCreating(true);

      const defaultSectionValues =
        (classSectionsSectionConfig.defaultValue?.[0] || {}) as Partial<SectionFormInput>;

      // Normalize sections using config defaults so dynamic step-2 and submit payload stay in sync.
      const rawSections: SectionFormInput[] = Array.isArray(data.sections) ? data.sections : [];
      const sections = rawSections
        .map((section) => ({ ...defaultSectionValues, ...section }))
        .filter(
          (section): section is SectionFormInput & { name: string } =>
            typeof section.name === "string" && section.name.trim() !== "",
        );

      if (sections.length === 0) {
        toast.error("Please add at least one section");
        setIsCreating(false);
        return;
      }

      const sectionNames = sections.map((section) => section.name.trim().toLowerCase());
      const uniqueNames = new Set(sectionNames);
      if (uniqueNames.size !== sectionNames.length) {
        toast.error("Section names must be unique. You have duplicate section names.");
        setIsCreating(false);
        return;
      }

      // Get current academic year ID
      const academicYearId = currentAcademicYear?.id;
      if (!academicYearId) {
        toast.error("Unable to determine current academic year");
        setIsCreating(false);
        return;
      }

      // Step 1: Create the class first
      const classPayload = {
        name: data.name,
        numericLevel: Number.parseInt(String(data.numericLevel), 10),
        description: data.description || "",
      };

      const createdClassResult = await createClass.mutateAsync(classPayload);
      const createdClass = createdClassResult as CreatedClassResponse;
      const createdClassId = createdClass?.data?.id || createdClass?.id;
      
      if (!createdClassId) {
        toast.error("Failed to create class - no ID returned");
        setIsCreating(false);
        return;
      }

      toast.success("Class created! Creating sections...");

      // Step 2: Create sections for the class using API
      const sectionPromises = sections.map(async (section): Promise<SectionCreateResult> => {
        const capacity =
          Number.parseInt(String(section.capacity), 10) ||
          Number.parseInt(String(defaultSectionValues["capacity"]), 10) ||
          40;

        const sectionPayload: {
          name: string;
          classId: string;
          academicYearId: string;
          capacity: number;
          classTeacherId?: string;
        } = {
          name: section.name.trim(),
          classId: createdClassId,
          academicYearId,
          capacity,
        };

        if (section.classTeacherId && typeof section.classTeacherId === "string" && section.classTeacherId.trim() !== "") {
          sectionPayload.classTeacherId = section.classTeacherId.trim();
        }

        try {
          await createSection.mutateAsync(sectionPayload);
          return { success: true };
        } catch (error: unknown) {
          const sectionError = error as ApiError;
          console.error("Section creation error:", sectionError.response?.data || sectionError.message);
          return { error, success: false };
        }
      });

      const sectionResults = await Promise.all(sectionPromises);

      const successCount = sectionResults.filter((r) => r.success === true).length;
      const failedCount = sectionResults.filter((r) => r.success !== true).length;

      if (failedCount === 0) {
        toast.success(`Class and ${successCount} section(s) created successfully!`);
        queryClient.refetchQueries({ queryKey: ["classes-with-sections"] });
        onSuccess?.();
      } else if (successCount > 0) {
        toast.warning(`Class created with ${successCount}/${sections.length} sections`);
        queryClient.refetchQueries({ queryKey: ["classes-with-sections"] });
        onSuccess?.();
      } else {
        toast.error("Class created but sections failed. Please add sections manually.");
        queryClient.refetchQueries({ queryKey: ["classes-with-sections"] });
        onSuccess?.();
      }

      setIsCreating(false);
    } catch (error: unknown) {
      const submitError = error as ApiError;
      console.error("Form submit error:", submitError);
      const message = submitError.response?.data?.message || submitError.message || "An error occurred";
      toast.error(message);
      setIsCreating(false);
    }
  };

  return (
    <div className="relative">
      {(createClass.isPending || isCreating) && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-50 flex items-center justify-center rounded-xl">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[11px] font-black uppercase tracking-widest text-slate-700">
              Creating Class & Sections...
            </p>
          </div>
        </div>
      )}

      <MultiStepFormEngine
        steps={classFormSteps}
        formConfig={classFormConfig}
        onCancel={onCancel}
        onSubmit={handleFormSubmit}
        submitButtonText={(createClass.isPending || isCreating) ? "Processing..." : "Create Class"}
      />
    </div>
  );
};
