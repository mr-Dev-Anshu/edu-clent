"use client";

import { CalendarDays, ChevronDown, X } from "lucide-react";
import { useEffect, useState } from "react";

import { classesHook } from "../hooks/useClasses";
import { ClassCategory, EditClassModalProps } from "../types";

export default function EditClassModal({
  open,
  data,
  onClose,
  onSuccess,
}: EditClassModalProps) {
  const { mutateAsync: updateClass } = classesHook.useUpdate();

  const [name, setName] = useState("");
  const [category, setCategory] = useState<ClassCategory>("primary");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!data) return;

    setName(data.name || "");
    setCategory(data.description || "primary");
  }, [data]);

  const resetForm = () => {
    setName("");
    setCategory("primary");
  };

  const handleClose = () => {
    if (loading) return;

    resetForm();
    onClose?.();
  };

  const getNumericLevel = () => {
    if (category === "primary") return 1;
    if (category === "secondary") return 6;
    return 11;
  };

  const handleSubmit = async () => {
    const finalName = name.trim();

    if (!finalName) {
      alert("Class name is required");
      return;
    }

    if (!data?.id) {
      alert("Class not found");
      return;
    }

    try {
      setLoading(true);

      await updateClass({
        id: data.id,
        data: {
          name: finalName,
          numericLevel: getNumericLevel(),
          description: category,
        },
      });

      onSuccess?.();
      handleClose();
    } catch (error: any) {
      alert(error?.response?.data?.message || "Unable to update class");
    } finally {
      setLoading(false);
    }
  };

  if (!open || !data) return null;

  return (
    <>
      <div
        onClick={handleClose}
        className="fixed inset-0 z-40 bg-[#455F87]/30 backdrop-blur-md"
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="w-full max-w-135 overflow-hidden rounded-2xl bg-white shadow-[0_12px_32px_rgba(2,36,72,0.08)]">
          <div className="relative bg-linear-to-br from-[#022448] to-[#1E3A5F] px-6 py-5 text-white">
            <h2 className="text-[28px] font-medium leading-none tracking-tight">
              Edit Class
            </h2>

            <p className="mt-1 text-[13px] text-white/70">
              Modify essential class metadata.
            </p>

            <button
              onClick={handleClose}
              disabled={loading}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-lg text-white/70 hover:bg-white/10 transition disabled:opacity-50"
            >
              <X size={18} />
            </button>
          </div>

          <div className="space-y-4 px-6 py-5 bg-white">
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                Class Name
              </label>

              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter class name"
                className="h-11 w-full rounded-xl bg-[#F7F9FB] px-4 text-sm text-slate-800 outline-none ring-1 ring-slate-200/70 focus:ring-[#1E3A5F]/30"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Category
                </label>

                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) =>
                      setCategory(e.target.value as ClassCategory)
                    }
                    className="h-11 w-full appearance-none rounded-xl bg-[#F7F9FB] px-4 text-sm text-slate-800 outline-none ring-1 ring-slate-200/70 focus:ring-[#1E3A5F]/30"
                  >
                    <option value="primary">Primary School</option>
                    <option value="secondary">Secondary School</option>
                    <option value="higher_secondary">Higher Secondary</option>
                  </select>

                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Academic Year
                </label>

                <div className="relative">
                  <input
                    value={data.academicYear || "Current Academic Year"}
                    disabled
                    className="h-11 w-full rounded-xl bg-[#F7F9FB] px-4 text-sm text-slate-500 outline-none ring-1 ring-slate-200/70"
                  />

                  <CalendarDays
                    size={16}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 bg-[#F7F9FB] px-6 py-4">
            <button
              onClick={handleClose}
              disabled={loading}
              className="h-10 px-4 text-sm font-medium text-slate-600 hover:text-slate-900 transition disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={!name.trim() || loading}
              className="h-10 min-w-37.5 rounded-xl bg-linear-to-br from-[#022448] to-[#1E3A5F] px-5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(2,36,72,0.14)] hover:opacity-95 transition disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
