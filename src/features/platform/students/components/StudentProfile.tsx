"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, Pencil, RefreshCw, UserRound } from "lucide-react";
import {
  AvatarCircle,
  EmptyState,
  SectionCard,
  StatusBadge,
} from "@/common/components/shared";
import { useHeader } from "@/hooks/useHeader";
import { formatDate } from "@/lib/formator";
import { useStudentService } from "../services/StudentService";
import { StudentStatusDialog } from "./StudentStatusDialog";
import { StudentGuardian, StudentStatus } from "../types";

interface StudentProfileProps {
  studentId: string;
}

const getFullName = (student?: {
  firstName?: string;
  middleName?: string;
  lastName?: string;
}) =>
  [student?.firstName, student?.middleName, student?.lastName]
    .filter(Boolean)
    .join(" ");

const getDisplayStatus = (status: StudentStatus) => {
  if (status === "transferred") {
    return { status: "inactive" as const, label: "Transferred" };
  }

  return { status, label: undefined };
};

const formatOptionalDate = (value?: string) => {
  if (!value) {
    return "Not provided";
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not provided";
  }

  return formatDate(parsedDate, "long");
};

const renderValue = (value?: string | number | null) => {
  if (value === undefined || value === null || value === "") {
    return "Not provided";
  }

  return String(value);
};

const renderBoolean = (value?: boolean) => {
  if (value === undefined) {
    return "Not provided";
  }

  return value ? "Yes" : "No";
};

const ProfileField = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <div className="space-y-1">
    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
      {label}
    </p>
    <p className="text-sm font-medium text-slate-800">{value}</p>
  </div>
);

const ProfileSkeleton = () => (
  <div className="space-y-6 p-6">
    <div className="h-40 animate-pulse rounded-2xl bg-slate-200" />
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <div className="h-72 animate-pulse rounded-2xl bg-slate-200" />
      <div className="h-72 animate-pulse rounded-2xl bg-slate-200" />
    </div>
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <div className="h-72 animate-pulse rounded-2xl bg-slate-200" />
      <div className="h-72 animate-pulse rounded-2xl bg-slate-200" />
    </div>
  </div>
);

export const StudentProfile = ({ studentId }: StudentProfileProps) => {
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const { data: student, isLoading, error } =
    useStudentService.useSingleData(studentId);

  const headerConfig = useMemo(
    () => ({
      moduleName: "Students",
      items: [
        { label: "Directory", href: "/platform/students" },
        { label: "Profile", href: `/platform/students/${studentId}` },
      ],
      actions: [],
    }),
    [studentId],
  );

  useHeader(headerConfig, () => {});

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (!student) {
    return (
      <div className="p-6">
        <SectionCard>
          <EmptyState
            icon={UserRound}
            title="Student profile not found"
            description={
              error instanceof Error
                ? error.message
                : "We couldn't load this student record."
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
  const displayStatus = getDisplayStatus(student.status);
  const guardians = student.guardians ?? [];

  return (
    <>
      <div className="space-y-6 p-6">
        <SectionCard
          className="overflow-hidden"
          bodyClassName="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-900 p-6 text-white"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-4">
              <AvatarCircle
                name={studentName}
                size="xl"
                className="ring-4 ring-white/20"
              />
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-200">
                    Student Profile
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">
                    {studentName}
                  </h2>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-sm text-slate-200">
                  <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1">
                    Admission No. {student.admissionNumber}
                  </span>
                  <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1">
                    Class {student.classId}
                  </span>
                  <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1">
                    Section {student.sectionId}
                  </span>
                </div>
                <StatusBadge
                  status={displayStatus.status}
                  label={displayStatus.label}
                  dot
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/platform/students"
                className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/15"
              >
                <ArrowLeft size={16} />
                Back to Directory
              </Link>
              <Link
                href={`/platform/students/${student.id}/edit`}
                className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-100"
              >
                <Pencil size={16} />
                Edit Details
              </Link>
              <button
                type="button"
                onClick={() => setIsStatusDialogOpen(true)}
                className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/15"
              >
                <RefreshCw size={16} />
                Change Status
              </button>
            </div>
          </div>
        </SectionCard>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <SectionCard
            title="Personal Details"
            description="Basic identity and profile information."
          >
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <ProfileField label="Full Name" value={studentName} />
              <ProfileField
                label="Date of Birth"
                value={formatOptionalDate(student.dateOfBirth)}
              />
              <ProfileField label="Gender" value={renderValue(student.gender)} />
              <ProfileField
                label="Blood Group"
                value={renderValue(student.bloodGroup)}
              />
              <ProfileField
                label="Nationality"
                value={renderValue(student.nationality)}
              />
              <ProfileField
                label="Religion"
                value={renderValue(student.religion)}
              />
              <ProfileField
                label="Category"
                value={renderValue(student.category)}
              />
              <ProfileField
                label="Aadhar Number"
                value={renderValue(student.aadharNumber)}
              />
            </div>
          </SectionCard>

          <SectionCard
            title="Academic Details"
            description="Enrollment, section, and academic placement."
          >
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <ProfileField
                label="Admission Number"
                value={renderValue(student.admissionNumber)}
              />
              <ProfileField
                label="Roll Number"
                value={renderValue(student.rollNumber)}
              />
              <ProfileField label="Class" value={renderValue(student.classId)} />
              <ProfileField
                label="Section"
                value={renderValue(student.sectionId)}
              />
              <ProfileField
                label="Academic Year"
                value={renderValue(student.academicYearId)}
              />
              <ProfileField
                label="Enrollment Date"
                value={formatOptionalDate(
                  student.enrollmentDate ?? student.createdAt,
                )}
              />
              <ProfileField
                label="Previous School"
                value={renderValue(student.previousSchool)}
              />
              <ProfileField
                label="Previous Class"
                value={renderValue(student.previousClass)}
              />
              <ProfileField
                label="Staff Ward"
                value={renderBoolean(student.isStaffWard)}
              />
              <ProfileField
                label="Last Updated"
                value={formatOptionalDate(student.updatedAt)}
              />
            </div>
          </SectionCard>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <SectionCard
            title="Contact & Health"
            description="Reachability, emergency, and support details."
          >
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <ProfileField label="Email" value={renderValue(student.email)} />
              <ProfileField
                label="Emergency Contact"
                value={renderValue(student.emergencyContactName)}
              />
              <ProfileField
                label="Emergency Phone"
                value={renderValue(student.emergencyContactPhone)}
              />
              <ProfileField
                label="Transport Required"
                value={renderBoolean(student.transportRequired)}
              />
              <ProfileField
                label="Hostel Required"
                value={renderBoolean(student.hostelRequired)}
              />
              <ProfileField
                label="Medical Conditions"
                value={renderValue(student.medicalConditions)}
              />
              <ProfileField
                label="Address"
                value={renderValue(student.address)}
              />
              <ProfileField label="City" value={renderValue(student.city)} />
              <ProfileField
                label="Pincode"
                value={renderValue(student.pincode)}
              />
            </div>
          </SectionCard>

          <SectionCard
            title="Guardians"
            description="Primary family and pickup contacts."
          >
            {guardians.length === 0 ? (
              <EmptyState
                title="No guardians added yet"
                description="Guardian details will appear here when they are available."
                className="py-10"
              />
            ) : (
              <div className="space-y-4">
                {guardians.map((guardian: StudentGuardian, index: number) => {
                  const guardianName = getFullName({
                    firstName: guardian.firstName,
                    lastName: guardian.lastName,
                  });

                  return (
                    <div
                      key={`${guardianName}-${index}`}
                      className="rounded-xl border border-slate-100 bg-slate-50 p-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {guardianName || `Guardian ${index + 1}`}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {renderValue(guardian.relation)}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {guardian.isPrimaryContact && (
                            <span className="rounded-full bg-green-100 px-2.5 py-1 text-[11px] font-medium text-green-700">
                              Primary Contact
                            </span>
                          )}
                          {guardian.canPickup && (
                            <span className="rounded-full bg-blue-100 px-2.5 py-1 text-[11px] font-medium text-blue-700">
                              Can Pickup
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                        <ProfileField
                          label="Email"
                          value={renderValue(guardian.email)}
                        />
                        <ProfileField
                          label="Phone"
                          value={renderValue(guardian.phone)}
                        />
                        <ProfileField
                          label="Occupation"
                          value={renderValue(guardian.occupation)}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </SectionCard>
        </div>
      </div>

      <StudentStatusDialog
        isOpen={isStatusDialogOpen}
        student={student}
        onClose={() => setIsStatusDialogOpen(false)}
      />
    </>
  );
};
