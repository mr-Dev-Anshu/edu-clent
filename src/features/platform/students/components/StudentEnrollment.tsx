"use client";

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { MultiStepFormEngine } from "@/common/components/shared/MultiStepFormEngine";
import { ENROLLMENT_STEPS } from "../constant/CONFIG_DATA";
import { useStudentService } from "../services/StudentService";
import { CreateStudentDto } from "../types";

interface StudentEnrollmentProps {
  onCancel: () => void;
  onSuccess: () => void;
}

export const StudentEnrollment = ({
  onCancel,
  onSuccess,
}: StudentEnrollmentProps) => {
  const queryClient = useQueryClient();
  const createStudent = useStudentService.useCreate();

  const steps = [
    { id: 0, title: "Personal Info", sections: ["personal-info"] },
    { id: 1, title: "Academic Info", sections: ["academic-info"] },
    { id: 2, title: "Contact & Health", sections: ["contact-health"] },
    { id: 3, title: "Guardians", sections: ["guardians"] },
  ];

  const handleFormSubmit = (data: CreateStudentDto) => {
    createStudent.mutate(data, {
      onSuccess: () => {
        toast.success("Student enrolled successfully!");
        queryClient.invalidateQueries({ queryKey: ["students"] });
        onSuccess();
      },
      onError: (error: unknown) => {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Unable to enroll the student. Please try again.";

        toast.error(errorMessage);
      },
    });
  };

  return (
    <div className="relative">
      {createStudent.isPending && (
        <div className="absolute inset-0 z-50 flex items-center justify-center rounded-xl bg-white/60 backdrop-blur-[2px]">
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
            <p className="text-[11px] font-black uppercase tracking-widest text-slate-700">
              Enrolling Student...
            </p>
          </div>
        </div>
      )}

      <MultiStepFormEngine
        steps={steps}
        formConfig={ENROLLMENT_STEPS}
        onCancel={onCancel}
        onSubmit={handleFormSubmit}
        submitButtonText={
          createStudent.isPending ? "Processing..." : "Enroll Student"
        }
      />
    </div>
  );
};
