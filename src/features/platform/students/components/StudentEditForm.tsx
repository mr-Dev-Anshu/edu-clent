"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { EmptyState, SectionCard } from "@/common/components/shared";
import { MultiStepFormEngine } from "@/common/components/shared/MultiStepFormEngine";
import { useHeader } from "@/hooks/useHeader";
import { useStudentService } from "../services/StudentService";
import {
  useAcademicYearService,
  useClassService,
  useSectionOptions,
} from "../services/StudentService";
import { ENROLLMENT_STEPS } from "../constant/CONFIG_DATA";
import {
  AcademicClass,
  AcademicSection,
  AcademicYear,
  CreateStudentDto,
  StudentType,
  UpdateStudentDto,
} from "../types";

interface StudentEditFormProps {
  studentId: string;
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

const steps = [
  { id: 0, title: "Personal Info", sections: ["personal-info"] },
  { id: 1, title: "Academic Info", sections: ["academic-info"] },
  { id: 2, title: "Contact & Health", sections: ["contact-health"] },
  { id: 3, title: "Guardians", sections: ["guardians"] },
];

const getFullName = (student?: {
  firstName?: string;
  middleName?: string;
  lastName?: string;
}) =>
  [student?.firstName, student?.middleName, student?.lastName]
    .filter(Boolean)
    .join(" ");

const getDefaultValues = (student: StudentType): CreateStudentDto => ({
  email: student.email ?? "",
  firstName: student.firstName ?? "",
  middleName: student.middleName ?? "",
  lastName: student.lastName ?? "",
  admissionNumber: student.admissionNumber ?? "",
  rollNumber: student.rollNumber ?? "",
  dateOfBirth: student.dateOfBirth ?? "",
  gender: student.gender,
  bloodGroup: student.bloodGroup ?? "",
  nationality: student.nationality ?? "",
  religion: student.religion ?? "",
  category: student.category ?? "",
  aadharNumber: student.aadharNumber ?? "",
  enrollmentDate: student.enrollmentDate ?? "",
  previousSchool: student.previousSchool ?? "",
  previousClass: student.previousClass ?? "",
  isStaffWard: student.isStaffWard ?? false,
  status: student.status,
  transportRequired: student.transportRequired ?? false,
  hostelRequired: student.hostelRequired ?? false,
  medicalConditions: student.medicalConditions ?? "",
  emergencyContactName: student.emergencyContactName ?? "",
  emergencyContactPhone: student.emergencyContactPhone ?? "",
  address: student.address ?? "",
  city: student.city ?? "",
  pincode: student.pincode ?? "",
  academicYearId: student.academicYearId ?? "",
  classId: student.classId ?? "",
  sectionId: student.sectionId ?? "",
  guardians: student.guardians ?? [],
});

const EditSkeleton = () => (
  <div className="space-y-6 p-6">
    <div className="h-28 animate-pulse rounded-2xl bg-slate-200" />
    <div className="h-[32rem] animate-pulse rounded-2xl bg-slate-200" />
  </div>
);

export const StudentEditForm = ({ studentId }: StudentEditFormProps) => {
  const router = useRouter();
  const methods = useForm<CreateStudentDto>({
    mode: "onChange",
    defaultValues: {
      guardians: [],
    },
  });
  const hydratedRef = useRef(false);
  const previousAcademicYearIdRef = useRef<string | undefined>(undefined);
  const previousClassIdRef = useRef<string | undefined>(undefined);

  const updateStudent = useStudentService.useUpdate();
  const {
    data: student,
    isLoading: isLoadingStudent,
    error,
  } = useStudentService.useSingleData(studentId);

  const academicYearId = methods.watch("academicYearId");
  const classId = methods.watch("classId");

  const { data: academicYearsResponse } =
    useAcademicYearService.usePaginatedData(1, 100);
  const { data: classesResponse } = useClassService.usePaginatedData(
    1,
    100,
    { academicYearId },
    { enabled: !!academicYearId },
  );
  const { data: sectionsOptionsData, isLoading: isLoadingSections } =
    useSectionOptions(classId ?? null, academicYearId ?? null);

  const academicYearsData = academicYearsResponse?.data;
  const classesData = classesResponse?.data;

  const headerConfig = useMemo(
    () => ({
      moduleName: "Students",
      items: [
        { label: "Directory", href: "/platform/students" },
        { label: "Profile", href: `/platform/students/${studentId}` },
        { label: "Edit Details", href: `/platform/students/${studentId}/edit` },
      ],
      actions: [],
    }),
    [studentId],
  );

  useHeader(headerConfig, () => {});

  useEffect(() => {
    if (!student) {
      return;
    }

    methods.reset(getDefaultValues(student));
    hydratedRef.current = true;
    previousAcademicYearIdRef.current = student.academicYearId ?? "";
    previousClassIdRef.current = student.classId ?? "";
  }, [student, methods]);

  useEffect(() => {
    if (!hydratedRef.current) {
      return;
    }

    if (!academicYearsData?.length || academicYearId) {
      return;
    }

    const firstYearId = academicYearsData[0].id;
    methods.setValue("academicYearId", firstYearId, { shouldValidate: true });
  }, [academicYearsData, academicYearId, methods]);

  useEffect(() => {
    if (!hydratedRef.current) {
      return;
    }

    const previousAcademicYearId = previousAcademicYearIdRef.current;

    if (
      previousAcademicYearId !== undefined &&
      previousAcademicYearId !== academicYearId
    ) {
      methods.setValue("classId", "");
      methods.setValue("sectionId", "");
    }

    previousAcademicYearIdRef.current = academicYearId;
  }, [academicYearId, methods]);

  useEffect(() => {
    if (!hydratedRef.current) {
      return;
    }

    const previousClassId = previousClassIdRef.current;

    if (previousClassId !== undefined && previousClassId !== classId) {
      methods.setValue("sectionId", "");
    }

    previousClassIdRef.current = classId;
  }, [classId, methods]);

  const dynamicFormConfig = useMemo(() => {
    const config = structuredClone(ENROLLMENT_STEPS) as EnrollmentSectionConfig[];
    const personalInfoSection = config.find(
      (section) => section.id === "personal-info",
    );
    const academicInfoSection = config.find(
      (section) => section.id === "academic-info",
    );

    if (personalInfoSection) {
      personalInfoSection.fields = personalInfoSection.fields.filter(
        (field) => field.id !== "password",
      );
    }

    if (academicInfoSection) {
      const classField = academicInfoSection.fields.find(
        (field) => field.id === "classId",
      );
      const sectionField = academicInfoSection.fields.find(
        (field) => field.id === "sectionId",
      );
      const academicYearField = academicInfoSection.fields.find(
        (field) => field.id === "academicYearId",
      );

      if (classField) {
        classField.options = (classesData ?? []).map((item: AcademicClass) => ({
          label: String(item.name),
          value: String(item.id),
        }));
      }

      if (sectionField) {
        sectionField.options = (sectionsOptionsData ?? []).map(
          (item: AcademicSection) => ({
            label: String(item.name),
            value: String(item.id),
          }),
        );
        sectionField.isLoading = isLoadingSections;
        sectionField.disabled = !classId || !academicYearId || isLoadingSections;
      }

      if (academicYearField) {
        academicYearField.options = (academicYearsData ?? []).map(
          (item: AcademicYear) => ({
            label: item.name || `${item.startDate} - ${item.endDate}`,
            value: String(item.id),
          }),
        );
      }
    }

    return config;
  }, [
    academicYearId,
    academicYearsData,
    classId,
    classesData,
    isLoadingSections,
    sectionsOptionsData,
  ]);

  const handleSubmit = (data: CreateStudentDto) => {
    const payload: UpdateStudentDto = {
      ...data,
      status: data.status ?? student?.status,
    };

    updateStudent.mutate(
      {
        id: studentId,
        data: payload,
      },
      {
        onSuccess: () => {
          toast.success("Student details updated successfully.");
          router.push(`/platform/students/${studentId}`);
        },
        onError: (mutationError: unknown) => {
          const errorMessage =
            mutationError instanceof Error
              ? mutationError.message
              : "Unable to update the student details. Please try again.";

          toast.error(errorMessage);
        },
      },
    );
  };

  if (isLoadingStudent) {
    return <EditSkeleton />;
  }

  if (!student) {
    return (
      <div className="p-6">
        <SectionCard>
          <EmptyState
            title="Student record not found"
            description={
              error instanceof Error
                ? error.message
                : "We couldn't open this student for editing."
            }
            action={
              <Link
                href="/platform/students"
                className="inline-flex rounded-lg bg-[#1E3A5F] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#152d4a]"
              >
                Back to Directory
              </Link>
            }
          />
        </SectionCard>
      </div>
    );
  }

  const studentName = getFullName(student);

  return (
    <div className="space-y-6 p-6">
      <SectionCard
        title={`Edit ${studentName}`}
        description="Update the student profile, academic mapping, and guardian information."
        headerSlot={
          <Link
            href={`/platform/students/${studentId}`}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
          >
            <ArrowLeft size={15} />
            View Profile
          </Link>
        }
      >
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Review the existing record carefully before saving. Status can also be changed from the profile page or the students list action menu.
        </div>
      </SectionCard>

      <div className="relative">
        {updateStudent.isPending && (
          <div className="absolute inset-0 z-50 flex items-center justify-center rounded-xl bg-white/60 backdrop-blur-[2px]">
            <div className="flex flex-col items-center gap-3">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
              <p className="text-[11px] font-black uppercase tracking-widest text-slate-700">
                Saving Changes...
              </p>
            </div>
          </div>
        )}

        <SectionCard noPadding>
          <MultiStepFormEngine
            steps={steps}
            formConfig={dynamicFormConfig}
            onCancel={() => router.push(`/platform/students/${studentId}`)}
            onSubmit={handleSubmit}
            methods={methods}
            submitButtonText={
              updateStudent.isPending ? "Saving..." : "Save Changes"
            }
          />
        </SectionCard>
      </div>
    </div>
  );
};
