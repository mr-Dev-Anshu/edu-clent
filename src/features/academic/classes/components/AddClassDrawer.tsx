"use client";

import { academicYearsHook } from "@/features/academic/classes/hooks/useAcademicYears";
import { ChevronDown, PlusCircle, Trash2, X } from "lucide-react";
import { useMemo, useState } from "react";
import { classesHook } from "../hooks/useClasses";
import { sectionsHook } from "../hooks/useSections";
import { AddClassDrawerProps, ClassCategory } from "../types";

interface SectionItem {
  id: string;
  name: string;
  teacher: string;
}

const DEFAULT_SECTIONS: SectionItem[] = [
  {
    id: crypto.randomUUID(),
    name: "Section A",
    teacher: "",
  },
  {
    id: crypto.randomUUID(),
    name: "Section B",
    teacher: "",
  },
];

export default function AddClassDrawer({
  open,
  onClose,
  onSuccess,
}: AddClassDrawerProps) {
  const { mutateAsync: createClass } = classesHook.useCreate();
  const { mutateAsync: createSection } = sectionsHook.useCreate();

  const { data: academicYears = [], isLoading: academicYearLoading } =
    academicYearsHook.useData();

  const currentAcademicYear = useMemo(
    () => academicYears.find((item) => item.isCurrent),
    [academicYears],
  );

  const [name, setName] = useState("");
  const [category, setCategory] = useState<ClassCategory>("primary");
  const [loading, setLoading] = useState(false);

  const [sections, setSections] = useState<SectionItem[]>(DEFAULT_SECTIONS);

  const getNumericLevel = () => {
    if (category === "primary") return 1;
    if (category === "secondary") return 6;
    return 11;
  };

  const resetForm = () => {
    setName("");
    setCategory("primary");
    setSections([
      {
        id: crypto.randomUUID(),
        name: "Section A",
        teacher: "",
      },
      {
        id: crypto.randomUUID(),
        name: "Section B",
        teacher: "",
      },
    ]);
  };

  const addSection = () => {
    const next = sections.length + 1;
    const letter = String.fromCharCode(64 + next);

    setSections((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: `Section ${letter}`,
        teacher: "",
      },
    ]);
  };

  const removeSection = (id: string) => {
    setSections((prev) => prev.filter((item) => item.id !== id));
  };

  const updateTeacher = (id: string, value: string) => {
    setSections((prev) =>
      prev.map((item) => (item.id === id ? { ...item, teacher: value } : item)),
    );
  };

  const handleClose = () => {
    if (loading) return;

    resetForm();
    onClose?.();
  };

  const validateSections = () => {
    const names = sections.map((item) => item.name.trim().toLowerCase());

    return new Set(names).size === names.length;
  };

  const handleSubmit = async () => {
    try {
      if (!name.trim()) {
        alert("Class name is required");
        return;
      }

      if (academicYearLoading) {
        alert("Academic year loading...");
        return;
      }

      if (!currentAcademicYear?.id) {
        alert("Current academic year not found");
        return;
      }

      if (!validateSections()) {
        alert("Duplicate section names are not allowed");
        return;
      }

      setLoading(true);

      const response: any = await createClass({
        name: name.trim(),
        numericLevel: getNumericLevel(),
        description: category,
      });

      const classId = response?.data?.id || response?.id;

      if (!classId) {
        throw new Error("Class ID not found");
      }

      await Promise.all(
        sections.map((item) =>
          createSection({
            name: item.name,
            classId,
            academicYearId: currentAcademicYear.id,
            capacity: 40,
            ...(item.teacher && {
              classTeacherId: item.teacher,
            }),
          }),
        ),
      );

      resetForm();
      onSuccess?.();
      onClose?.();
    } catch (error: any) {
      console.error(error);

      alert(error?.response?.data?.message || "Unable to create class");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <>
      <div
        onClick={handleClose}
        className="fixed inset-0 z-100 bg-[#5F7391]/5 backdrop-blur-md h-screen"
      />

      <div className="fixed top-0 right-0 z-999 h-screen w-full max-w-115 bg-white flex flex-col shadow-[0_12px_32px_rgba(2,36,72,0.12)]">
        <div className="h-14 px-5 flex items-center justify-between border-b border-slate-200">
          <h2 className="text-[20px] font-semibold text-[#022448] tracking-tight">
            Add New Class
          </h2>

          <button
            onClick={handleClose}
            disabled={loading}
            className="h-9 w-9 rounded-lg flex items-center justify-center hover:bg-slate-100 transition disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-5">
          <div>
            <p className="text-[11px] uppercase tracking-[0.12em] font-semibold text-slate-500 mb-2">
              Class Details
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-[13px] font-medium text-slate-700 block mb-1.5">
                  Class Name
                </label>

                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Grade 12"
                  className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-[#1E3A5F]"
                />
              </div>

              <div>
                <label className="text-[13px] font-medium text-slate-700 block mb-1.5">
                  Category
                </label>

                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) =>
                      setCategory(e.target.value as ClassCategory)
                    }
                    className="appearance-none h-10 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-[#1E3A5F] bg-white"
                  >
                    <option value="primary">Primary School</option>
                    <option value="secondary">Secondary School</option>
                    <option value="higher_secondary">Higher Secondary</option>
                  </select>

                  <ChevronDown
                    size={16}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] uppercase tracking-[0.12em] font-semibold text-slate-500">
                Sections & Teachers
              </p>

              <button
                type="button"
                onClick={addSection}
                className="flex items-center gap-1 text-[13px] font-semibold text-[#022448]"
              >
                <PlusCircle size={14} />
                Add
              </button>
            </div>

            <div className="space-y-2.5">
              {sections.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg bg-[#F4F5F7] border border-slate-200 p-3"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-1 rounded-full bg-[#1E3A5F] text-white text-[11px] font-semibold">
                      {item.name}
                    </span>

                    <button
                      type="button"
                      onClick={() => removeSection(item.id)}
                      className="text-red-600 hover:opacity-80"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div className="relative">
                    <select
                      value={item.teacher}
                      onChange={(e) => updateTeacher(item.id, e.target.value)}
                      className="appearance-none h-10 w-full rounded-lg border border-slate-300 px-3 text-sm bg-white outline-none focus:border-[#1E3A5F]"
                    >
                      <option value="">Assign Class Teacher</option>
                    </select>

                    <ChevronDown
                      size={16}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 bg-white">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="h-11 w-full rounded-lg bg-[#022448] text-white text-sm font-semibold shadow-[0_10px_25px_rgba(2,36,72,0.18)] hover:bg-[#1E3A5F] transition disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Class"}
          </button>
        </div>
      </div>
    </>
  );
}
