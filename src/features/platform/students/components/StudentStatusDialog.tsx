"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Modal, StatusBadge } from "@/common/components/shared";
import { cn } from "@/lib/utils";
import { useStudentService } from "../services/StudentService";
import { StudentStatus, StudentType } from "../types";

interface StudentStatusDialogProps {
  isOpen: boolean;
  student: StudentType | null;
  onClose: () => void;
}

const STATUS_OPTIONS: Array<{
  value: StudentStatus;
  label: string;
  description: string;
}> = [
  {
    value: "active",
    label: "Active",
    description: "The student can continue all regular academic activity.",
  },
  {
    value: "inactive",
    label: "Inactive",
    description: "The student remains on record, but is no longer active.",
  },
  {
    value: "transferred",
    label: "Transferred",
    description: "Use this when the student has moved to another school.",
  },
];

const getDisplayStatus = (status: StudentStatus) => {
  if (status === "transferred") {
    return { status: "inactive" as const, label: "Transferred" };
  }

  return { status, label: undefined };
};

export const StudentStatusDialog = ({
  isOpen,
  student,
  onClose,
}: StudentStatusDialogProps) => {
  const updateStudent = useStudentService.useUpdate();
  const [selectedStatus, setSelectedStatus] = useState<StudentStatus>("active");

  useEffect(() => {
    if (student) {
      setSelectedStatus(student.status);
    }
  }, [student]);

  if (!student) {
    return null;
  }

  const studentName = [student.firstName, student.lastName]
    .filter(Boolean)
    .join(" ");
  const currentStatus = getDisplayStatus(student.status);
  const nextStatus = getDisplayStatus(selectedStatus);
  const isUnchanged = selectedStatus === student.status;

  const handleSubmit = () => {
    updateStudent.mutate(
      {
        id: student.id,
        data: { status: selectedStatus },
      },
      {
        onSuccess: () => {
          toast.success(`${studentName}'s status has been updated.`);
          onClose();
        },
        onError: (error: unknown) => {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Unable to update the student status right now.";

          toast.error(errorMessage);
        },
      },
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Change Student Status">
      <div className="space-y-5">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-900">{studentName}</p>
          <p className="mt-1 text-xs text-slate-500">
            Admission No. {student.admissionNumber}
          </p>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500">
              Current status
            </span>
            <StatusBadge
              status={currentStatus.status}
              label={currentStatus.label}
              size="sm"
              dot
            />
          </div>
        </div>

        <div className="space-y-3">
          {STATUS_OPTIONS.map((option) => {
            const displayStatus = getDisplayStatus(option.value);
            const isSelected = selectedStatus === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setSelectedStatus(option.value)}
                className={cn(
                  "w-full rounded-xl border px-4 py-3 text-left transition-colors",
                  isSelected
                    ? "border-indigo-500 bg-indigo-50 shadow-sm"
                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50",
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {option.label}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {option.description}
                    </p>
                  </div>
                  <StatusBadge
                    status={displayStatus.status}
                    label={displayStatus.label}
                    size="sm"
                  />
                </div>
              </button>
            );
          })}
        </div>

        <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
          <p className="text-xs font-medium text-slate-500">New status</p>
          <div className="mt-2">
            <StatusBadge
              status={nextStatus.status}
              label={nextStatus.label}
              size="sm"
              dot
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isUnchanged || updateStudent.isPending}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors",
              isUnchanged || updateStudent.isPending
                ? "cursor-not-allowed bg-slate-300"
                : "bg-[#1E3A5F] hover:bg-[#152d4a]",
            )}
          >
            {updateStudent.isPending ? "Updating..." : "Update Status"}
          </button>
        </div>
      </div>
    </Modal>
  );
};
