"use client";
import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { MultiStepFormEngine } from "@/common/components/shared/MultiStepFormEngine";
import { ClassWithSections, useClass } from "../services/ClassService";
import { classDetailsSectionConfig } from "../constant/CONFIG_DATA";

type EditClassFormValues = {
  name: string;
  numericLevel: string | number;
  description?: string;
};

type ApiError = {
  response?: { data?: { message?: string } };
  message?: string;
};

const editClassFormSteps = [{ id: 0, title: "Class Details", sections: ["step1"] }];

const editClassFormConfig = [classDetailsSectionConfig];

export const EditClassForm = ({
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
  const updateClass = useClass.useUpdate();

  const handleSubmit = async (formData: EditClassFormValues) => {
    try {
      setIsUpdating(true);

      const payload = {
        name: formData.name.trim(),
        numericLevel: Number.parseInt(String(formData.numericLevel), 10),
        description: formData.description?.trim() || "",
      };

      await updateClass.mutateAsync({
        id: classData.id,
        data: payload,
      });

      toast.success("Class updated successfully!");
      onSuccess();
      onClose();
      void queryClient.refetchQueries({ queryKey: ["classes-with-sections"] });
    } catch (error: unknown) {
      const classError = error as ApiError;
      const errMsg = classError.response?.data?.message || classError.message || "Failed to update class";
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
            <p className="text-[11px] font-black uppercase tracking-widest text-slate-700">Updating Class...</p>
          </div>
        </div>
      )}

      <MultiStepFormEngine
        steps={editClassFormSteps}
        formConfig={editClassFormConfig}
        onCancel={onClose}
        onSubmit={handleSubmit}
        submitButtonText={isUpdating ? "Updating..." : "Update Class"}
        defaultValues={{
          name: classData.name,
          numericLevel: classData.numericLevel,
          description: classData.description || "",
        }}
      />
    </div>
  );
};
