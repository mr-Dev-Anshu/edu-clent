"use client";

import React, { useEffect, useState } from "react";
import { AlertTriangle, Plus, Trash2 } from "lucide-react";
import { Modal } from "@/common/components/shared";
import { useClasses } from "../services/ClassService";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// ─── Edit Class Modal ──────────────────────────────────────────────────────────
export const EditClassModal = ({
  isOpen,
  onClose,
  classData,
}: {
  isOpen: boolean;
  onClose: () => void;
  classData: any;
}) => {
  const queryClient = useQueryClient();
  const updateClass = useClasses.useUpdate?.();

  const [form, setForm] = useState({
    className: "",
    category: "",
    academicYear: "",
  });

  useEffect(() => {
    if (classData) {
      setForm({
        className: classData?.className || classData?.name || "",
        category: classData?.category || "",
        academicYear: classData?.academicYear || "",
      });
    }
  }, [classData]);

  const handleSave = () => {
    updateClass?.mutate(
      {
        id: classData?.id,
        className: form.className,
        name: form.className,
        category: form.category,
        academicYear: form.academicYear,
      },
      {
        onSuccess: () => {
          toast.success("Class updated successfully!");
          queryClient.invalidateQueries({ queryKey: ["classes"] });
          queryClient.invalidateQueries({ queryKey: ["classes", "list"] });
          onClose();
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.message ||
              error?.message ||
              "Failed to update class."
          );
        },
      }
    );
  };

  if (!isOpen) return null;

  return (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
    <div className="w-full max-w-md overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0px_12px_32px_rgba(2,36,72,0.18)]">
     <div className="relative z-20 block min-h-[110px] w-full !bg-[#082d57] px-8 py-7 !text-white !opacity-100">
  <div className="relative z-30 flex w-full items-start justify-between">
    <div className="block">
      <h2 className="block !text-[24px] !font-semibold !leading-7 !text-white !opacity-100">
        Edit Class
      </h2>

      <p className="mt-2 block !text-[14px] !font-medium !leading-5 !text-blue-200 !opacity-100">
        Modify essential class metadata and configuration.
      </p>
    </div>

    <button
      type="button"
      onClick={onClose}
      className="relative z-40 flex h-9 w-9 items-center justify-center rounded-lg !bg-transparent !text-[28px] !leading-none !text-white !opacity-100 hover:!bg-white/10"
    >
      ×
    </button>
  </div>
</div>

      <div className="space-y-6 p-8">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Class Name
            </label>

            <div className="relative">
              <input
                value={form.className}
                onChange={(e) =>
                  setForm((p) => ({ ...p, className: e.target.value }))
                }
                placeholder="e.g. Grade 10"
                className="h-12 w-full rounded-lg border border-slate-200 bg-slate-100 px-4 pr-11 text-sm font-medium text-slate-900 outline-none transition focus:border-[#022448] focus:bg-white focus:ring-2 focus:ring-[#022448]/15"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg font-semibold text-slate-400">
                T
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Category
              </label>

              <select
                value={form.category}
                onChange={(e) =>
                  setForm((p) => ({ ...p, category: e.target.value }))
                }
                className="h-12 w-full appearance-none rounded-lg border border-slate-200 bg-slate-100 px-4 pr-10 text-sm font-medium text-slate-900 outline-none transition focus:border-[#022448] focus:bg-white focus:ring-2 focus:ring-[#022448]/15"
              >
                <option value="">Select Category</option>
                <option value="PRIMARY_SCHOOL">Primary School</option>
                <option value="SECONDARY_SCHOOL">Secondary School</option>
                <option value="HIGHER_SECONDARY">Higher Secondary</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Academic Year
              </label>

              <div className="relative">
                <input
                  value={form.academicYear}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, academicYear: e.target.value }))
                  }
                  placeholder="2025 - 2026"
                  className="h-12 w-full rounded-lg border border-slate-200 bg-slate-100 px-4 pr-11 text-sm font-medium text-slate-900 outline-none transition focus:border-[#022448] focus:bg-white focus:ring-2 focus:ring-[#022448]/15"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-base text-slate-400">
                  📅
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-slate-200" />

        <div className="flex items-center justify-end gap-4 pt-2">
  <button
    type="button"
    onClick={onClose}
    className="inline-flex h-11 min-w-[96px] items-center justify-center rounded-lg border border-slate-300 bg-white px-6 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-100 hover:text-slate-900"
  >
    Cancel
  </button>

  <button
    type="button"
    onClick={handleSave}
    disabled={updateClass?.isPending}
    className="inline-flex h-11 min-w-[145px] items-center justify-center rounded-lg border border-[#022448] bg-[#022448] px-8 text-sm font-bold text-white shadow-lg shadow-[#022448]/25 transition hover:bg-[#1e3a5f] disabled:cursor-not-allowed disabled:opacity-60"
  >
    {updateClass?.isPending ? "Saving..." : "Save Changes"}
  </button>
</div>
      </div>
    </div>
  </div>
);
};

// ─── Manage Sections Modal ─────────────────────────────────────────────────────
export const ManageSectionsModal = ({
  isOpen,
  onClose,
  classData,
}: {
  isOpen: boolean;
  onClose: () => void;
  classData: any;
}) => {
  const [sections, setSections] = useState<any[]>(classData?.sections || []);
  const [newSectionName, setNewSectionName] = useState("");
  const [newTeacher, setNewTeacher] = useState("");
  const [showAddRow, setShowAddRow] = useState(false);

  const handleDelete = (id: string) =>
    setSections((prev) => prev.filter((s) => s.id !== id));

  const handleAddSection = () => {
    if (!newSectionName.trim()) return;
    setSections((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sectionName: newSectionName,
        assignedTeacher: { name: newTeacher || "Unassigned", avatar: null },
      },
    ]);
    setNewSectionName("");
    setNewTeacher("");
    setShowAddRow(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" className="max-w-xl">
      {/* Header */}
      <div className="-mx-6 -mt-6 border-b border-slate-100 px-6 py-4">
        <h2 className="text-lg font-bold text-slate-900">Manage Sections</h2>
        <p className="text-sm text-slate-500">{classData?.className}</p>
      </div>

      {/* Column headers */}
      <div className="divide-y divide-slate-100">
        <div className="grid grid-cols-[1fr_1fr_60px] px-2 py-3">
          <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
            Section Name
          </span>
          <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
            Assigned Teacher
          </span>
          <span className="text-right text-[11px] font-bold uppercase tracking-widest text-slate-400">
            Action
          </span>
        </div>

        {/* Section rows */}
        {sections.length === 0 && !showAddRow && (
          <div className="px-2 py-8 text-center text-[13px] text-slate-400">
            No sections yet. Add one below.
          </div>
        )}

        {sections.map((section) => (
          <div
            key={section.id}
            className="grid grid-cols-[1fr_1fr_60px] items-center px-2 py-4"
          >
            <span className="text-[14px] font-semibold text-slate-800">
              {section.sectionName}
            </span>
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-200 text-[10px] font-bold text-slate-600">
                {section.assignedTeacher?.avatar ? (
                  <img
                    src={section.assignedTeacher.avatar}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  section.assignedTeacher?.name?.[0] || "?"
                )}
              </div>
              <span className="text-[13px] text-slate-700">
                {section.assignedTeacher?.name || "Unassigned"}
              </span>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => handleDelete(section.id)}
                className="rounded-lg p-2 text-slate-400 transition-all hover:bg-red-50 hover:text-red-500"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}

        {/* Inline add row */}
        {showAddRow && (
          <div className="grid grid-cols-[1fr_1fr_60px] items-center gap-2 px-2 py-3">
            <input
              autoFocus
              type="text"
              value={newSectionName}
              onChange={(e) => setNewSectionName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddSection()}
              placeholder="Section name"
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              value={newTeacher}
              onChange={(e) => setNewTeacher(e.target.value)}
              placeholder="Teacher name"
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex justify-end">
              <button
                onClick={handleAddSection}
                className="rounded-md bg-indigo-600 px-2 py-1 text-[11px] font-semibold text-white hover:bg-indigo-700 transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
        <button
          onClick={onClose}
          className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-700"
        >
          Cancel
        </button>
        <button
          onClick={() => setShowAddRow(true)}
          className="flex items-center gap-2 rounded-lg bg-[#1a2744] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#243460]"
        >
          <Plus size={15} />
          Add New Section
        </button>
      </div>
    </Modal>
  );
};

// ─── Delete Confirm Modal ──────────────────────────────────────────────────────
export const DeleteClassModal = ({
  isOpen,
  onClose,
  classData,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  classData: any;
  onConfirm: () => void;
}) => {
  const queryClient = useQueryClient();
  const deleteClass = useClasses.useDelete?.();

  const handleDelete = () => {
    deleteClass?.mutate(classData?.id, {
      onSuccess: () => {
        toast.success("Class deleted successfully.");
        queryClient.invalidateQueries({ queryKey: ["classes", "list"] });
        onConfirm();
        onClose();
      },
      onError: (error: any) =>
        toast.error(error?.message || "Failed to delete class."),
    });
  };

  return (
  <div className="bg-white">
    <div className="px-6 py-6">
      <div className="mb-8 border-l-4 border-indigo-500 pl-5">
        <h3 className="text-lg font-black uppercase tracking-widest text-slate-800">
          Class Details
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="mb-2 block text-xs font-bold uppercase text-slate-400">
            Class Name
          </label>
          <input
            value={form.className}
            onChange={(e) => updateField("className", e.target.value)}
            placeholder="e.g. Grade 12"
            className="h-14 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold uppercase text-slate-400">
            Category
          </label>
          <select
            value={form.category}
            onChange={(e) => updateField("category", e.target.value)}
            className="h-14 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-indigo-500"
          >
            <option value="">Select category</option>
            <option value="PRIMARY_SCHOOL">Primary School</option>
            <option value="SECONDARY_SCHOOL">Secondary School</option>
            <option value="HIGHER_SECONDARY">Higher Secondary</option>
          </select>
        </div>
      </div>

      <div className="mt-12 mb-6 flex items-center justify-between border-l-4 border-indigo-500 pl-5">
        <h3 className="text-lg font-black uppercase tracking-widest text-slate-800">
          Sections & Teachers
        </h3>

        <button
          type="button"
          onClick={addSection}
          className="flex items-center gap-2 text-sm font-bold text-[#0f172a]"
        >
          <Plus size={15} />
          Add Section
        </button>
      </div>

      <div className="space-y-4">
        {form.sections.map((section, index) => (
          <div key={index} className="rounded-xl bg-slate-100 p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="rounded-full bg-[#0f172a] px-4 py-1 text-xs font-bold text-white">
                {section.sectionName || `Section ${index + 1}`}
              </span>

              <button
                type="button"
                onClick={() => removeSection(index)}
                className="text-red-500"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <select
              value={section.teacher}
              onChange={(e) => updateSection(index, "teacher", e.target.value)}
              className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-indigo-500"
            >
              <option value="">Assign Class Teacher</option>
              <option value="teacher-1">Teacher 1</option>
              <option value="teacher-2">Teacher 2</option>
            </select>
          </div>
        ))}
      </div>
    </div>

    <div className="border-t border-slate-100 px-6 py-5">
      <button
        type="button"
        onClick={handleSubmit}
        disabled={createClass.isPending}
        className="h-12 w-full rounded-xl bg-[#0f172a] text-sm font-bold text-white disabled:opacity-60"
      >
        {createClass.isPending ? "Creating..." : "Create Class"}
      </button>
    </div>
  </div>
);
};