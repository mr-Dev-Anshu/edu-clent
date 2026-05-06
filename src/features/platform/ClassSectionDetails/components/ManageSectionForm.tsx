"use client";

import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { MultiStepFormEngine } from "@/common/components/shared/MultiStepFormEngine";
import { Section, useSection } from "../../ClassSections/services/ClassService";
import { sectionEditFormConfig, sectionEditFormSteps } from "../constant/CONFIG_DATA";

type SectionEditFormValues = {
  name: string;
  capacity: string | number;
  classTeacherId?: string;
};

type ApiError = {
  response?: { data?: { message?: string } };
  message?: string;
};

export const ManageSectionForm = ({
  sectionData,
  onClose,
  onSuccess,
}: {
  sectionData: Section;
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const queryClient = useQueryClient();
  const updateSection = useSection.useUpdate();

  // Prepare form config with teacher options
  const formConfig = sectionEditFormConfig.map((section) => ({
    ...section,
    fields: section.fields.map((field) =>
      field.id === "classTeacherId"
        ? {
            ...field,
            options: sectionData?.classTeacher
              ? ["", sectionData.classTeacher.id]
              : [""],
          }
        : field
    ),
  }));

  const handleSubmit = async (formData: SectionEditFormValues) => {
    try {
      setIsUpdating(true);

      const payload = {
        name: formData.name.trim(),
        capacity: Number.parseInt(String(formData.capacity), 10) || 40,
        ...(formData.classTeacherId?.trim() && { classTeacherId: formData.classTeacherId.trim() }),
      };

      await updateSection.mutateAsync({
        id: sectionData.id,
        data: payload,
      });

      toast.success("Section updated successfully!");
      onSuccess();
      onClose();
      
      // Refresh related queries
      void queryClient.refetchQueries({ queryKey: ["sections"] });
      void queryClient.refetchQueries({ queryKey: ["classes-with-sections"] });
      void queryClient.refetchQueries({ queryKey: [`class-sections-${sectionData.classId}`], exact: false });
    } catch (error: unknown) {
      const err = error as ApiError;
      toast.error(err.response?.data?.message || err.message || "Failed to update section");
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
            <p className="text-[11px] font-black uppercase tracking-widest text-slate-700">Updating Section...</p>
          </div>
        </div>
      )}

      <MultiStepFormEngine
        steps={sectionEditFormSteps}
        formConfig={formConfig}
        onCancel={onClose}
        onSubmit={handleSubmit}
        submitButtonText={isUpdating ? "Updating..." : "Update Section"}
        defaultValues={{
          name: sectionData.name,
          capacity: sectionData.capacity,
          classTeacherId: sectionData.classTeacherId || "",
        }}
      />
    </div>
  );
};
