"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, X } from "lucide-react";
import { useMemo, useState } from "react";

import { academicYearsHook } from "../hooks/useAcademicYears";
import { sectionsHook } from "../hooks/useSections";
import { ManageSectionsModalProps } from "../types";

export default function ManageSectionsModal({
  open,
  classData,
  onClose,
  onSuccess,
}: ManageSectionsModalProps) {
  const queryClient = useQueryClient();

  const { mutateAsync: createSection } = sectionsHook.useCreate();
  const { mutateAsync: removeSection } = sectionsHook.useRemove();

  const { data: academicYears = [] } = academicYearsHook.useData();

  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const currentAcademicYearId = useMemo(() => {
    const current = academicYears.find((item: any) => item.isCurrent);
    return current?.id || "";
  }, [academicYears]);

  const sections = useMemo(() => classData?.sections || [], [classData]);

  const handleClose = () => {
    if (creating || loadingId) return;
    onClose?.();
  };

  const refreshClasses = async () => {
    await queryClient.invalidateQueries({
      queryKey: ["classes"],
    });
  };

  const handleDelete = async (id: string) => {
    try {
      setLoadingId(id);

      await removeSection(id);
      await refreshClasses();

      onSuccess?.();
      onClose?.();
    } catch (error: any) {
      alert(error?.response?.data?.message || "Unable to delete section");
    } finally {
      setLoadingId(null);
    }
  };

  const handleAddSection = async () => {
    if (!classData?.id) return;

    if (!currentAcademicYearId) {
      alert("Current academic year not found");
      return;
    }

    try {
      setCreating(true);

      const next = sections.length + 1;
      const letter = String.fromCharCode(64 + next);

      await createSection({
        name: `Section ${letter}`,
        classId: classData.id,
        academicYearId: currentAcademicYearId,
        capacity: 40,
      });

      await refreshClasses();

      onSuccess?.();
      onClose?.();
    } catch (error: any) {
      alert(error?.response?.data?.message || "Unable to create section");
    } finally {
      setCreating(false);
    }
  };

  if (!open || !classData) return null;

  return (
    <>
      <div
        onClick={handleClose}
        className="fixed inset-0 z-40 bg-[#455F87]/28 backdrop-blur-md"
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="w-full max-w-155 overflow-hidden rounded-2xl bg-white shadow-[0_12px_32px_rgba(2,36,72,0.08)]">
          <div className="relative px-6 py-5 bg-white">
            <h2 className="text-[28px] font-medium tracking-tight text-[#191C1E]">
              Manage Sections
            </h2>

            <p className="mt-1 text-[13px] text-slate-500">{classData.name}</p>

            <button
              onClick={handleClose}
              disabled={creating || !!loadingId}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-lg hover:bg-slate-100 transition disabled:opacity-50"
            >
              <X size={18} className="text-slate-700" />
            </button>
          </div>

          <div className="px-6">
            <div className="grid grid-cols-[1.1fr_1.4fr_70px] bg-[#ECEEF0] rounded-xl px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600">
              <div>Section</div>
              <div>Teacher</div>
              <div className="text-right">Action</div>
            </div>

            <div className="mt-1 space-y-px bg-[#ECEEF0] rounded-xl overflow-hidden">
              {sections.length === 0 && (
                <div className="bg-white py-8 text-center text-sm text-slate-500">
                  No sections found.
                </div>
              )}

              {sections.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[1.1fr_1.4fr_70px] items-center bg-white px-4 py-3"
                >
                  <div className="text-sm font-medium text-[#022448]">
                    {item.name}
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#022448] text-[11px] font-semibold text-white">
                      {item.teacher?.name?.charAt(0) || "T"}
                    </div>

                    <span className="text-sm text-slate-700 truncate">
                      {item.teacher?.name || "Unassigned"}
                    </span>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={loadingId === item.id || creating}
                      className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-red-50 disabled:opacity-50"
                    >
                      <Trash2
                        size={15}
                        className="text-slate-600 hover:text-red-600"
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between bg-[#F7F9FB] px-6 py-4">
            <button
              onClick={handleClose}
              disabled={creating || !!loadingId}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              onClick={handleAddSection}
              disabled={creating || !!loadingId}
              className="flex h-10 items-center gap-2 rounded-xl bg-linear-to-br from-[#022448] to-[#1E3A5F] px-5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(2,36,72,0.14)] disabled:opacity-50"
            >
              <Plus size={15} />
              {creating ? "Adding..." : "Add Section"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
