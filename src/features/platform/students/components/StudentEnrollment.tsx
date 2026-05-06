"use client";

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { MultiStepFormEngine } from "@/common/components/shared/MultiStepFormEngine";
import { ENROLLMENT_STEPS } from "../constant/CONFIG_DATA";
import { useStudentService } from "../services/StudentService";
import {
  AcademicClass,
  AcademicSection,
  AcademicYear,
  CreateStudentDto,
} from "../types";
import { useForm } from "react-hook-form";
import { useClassService, useAcademicYearService, useSectionOptions } from "../services/StudentService";
import { useMemo, useEffect } from "react";

interface StudentEnrollmentProps {
  onCancel: () => void;
  onSuccess: () => void;
}

interface EnrollmentFieldOption {
  label: string;
  value: string;
}

interface EnrollmentFieldConfig {
  id: string;
  options?: EnrollmentFieldOption[] | string[];
  isLoading?: boolean;
  disabled?: boolean;
}

interface EnrollmentSectionConfig {
  id: string;
  fields: EnrollmentFieldConfig[];
}

export const StudentEnrollment = ({
  onCancel,
  onSuccess,
}: StudentEnrollmentProps) => {
  const queryClient = useQueryClient();
  const createStudent = useStudentService.useCreate();

  const methods = useForm<CreateStudentDto>({ mode: "onChange" });
  const academicYearId = methods.watch("academicYearId");
  const classId = methods.watch("classId");

  const { data: academicYearsResponse } = useAcademicYearService.usePaginatedData(1, 100);
  const { data: classesResponse } = useClassService.usePaginatedData(
    1, 
    100, 
    { academicYearId }, 
    { enabled: !!academicYearId }
  );
  const { data: sectionsOptionsData, isLoading: isLoadingSections } = useSectionOptions(
    classId ?? null,
    academicYearId ?? null
  );

  const classesData = classesResponse?.data;
  const academicYearsData = academicYearsResponse?.data;

  useEffect(() => {
    // Automatically reset classId and sectionId when academicYearId changes
    if (academicYearId) {
      methods.setValue("classId", "");
      methods.setValue("sectionId", "");
    }
  }, [academicYearId, methods]);

  useEffect(() => {
    // Auto-select the first academic year if none is selected
    if (academicYearsData && academicYearsData.length > 0 && !academicYearId) {
      const firstYearId = academicYearsData[0].id;
      methods.setValue("academicYearId", firstYearId, { shouldValidate: true });
    }
  }, [academicYearsData, academicYearId, methods]);

  useEffect(() => {
    // Automatically reset sectionId when classId changes
    if (classId) {
      methods.setValue("sectionId", "");
    }
  }, [classId, methods]);

  const dynamicFormConfig = useMemo(() => {
    const config = structuredClone(ENROLLMENT_STEPS) as EnrollmentSectionConfig[];
    
    // Find academic-info step
    const academicStep = config.find((section) => section.id === "academic-info");
    if (academicStep) {
      const classField = academicStep.fields.find((field) => field.id === "classId");
      const sectionField = academicStep.fields.find((field) => field.id === "sectionId");
      const academicYearField = academicStep.fields.find((field) => field.id === "academicYearId");

      if (classField && classesData) {
        classField.options = classesData.map((studentClass: AcademicClass) => ({
          label: String(studentClass.name),
          value: String(studentClass.id),
        }));
      }

      if (sectionField) {
        sectionField.options = sectionsOptionsData
          ? sectionsOptionsData.map((section: AcademicSection) => ({
              label: String(section.name),
              value: String(section.id),
            }))
          : [];
        sectionField.isLoading = isLoadingSections;
        sectionField.disabled = !classId || !academicYearId || isLoadingSections;
      }

      if (academicYearField && academicYearsData) {
        academicYearField.options = academicYearsData.map((academicYear: AcademicYear) => ({
          label: academicYear.name || `${academicYear.startDate} - ${academicYear.endDate}`,
          value: String(academicYear.id),
        }));
      }
    }
    return config;
  }, [classesData, sectionsOptionsData, academicYearsData, classId, academicYearId, isLoadingSections]);

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
        formConfig={dynamicFormConfig}
        onCancel={onCancel}
        onSubmit={handleFormSubmit}
        methods={methods}
        submitButtonText={
          createStudent.isPending ? "Processing..." : "Enroll Student"
        }
      />
    </div>
  );
};
