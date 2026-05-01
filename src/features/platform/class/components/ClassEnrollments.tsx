"use client";

import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useClasses } from "../services/ClassService";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const ClassEnrollment = ({ onCancel, onSuccess }: any) => {
  const queryClient = useQueryClient();
  const createClass = useClasses.useCreate();

  const [form, setForm] = useState<{
  className: string;
  category: string;
  academicYear: string;
  sections: { sectionName: string; teacher: string }[];
}>({
  className: "",
  category: "",
  academicYear: "",
  sections: [
  { sectionName: "Section A", teacher: "" },
  { sectionName: "Section B", teacher: "" },
],
});

  const updateField = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const updateSection = (index: number, name: string, value: string) => {
    const updated = [...form.sections];
    updated[index] = { ...updated[index], [name]: value };
    setForm((prev) => ({ ...prev, sections: updated }));
  };

  const addSection = () => {
    setForm((prev) => ({
      ...prev,
      sections: [...prev.sections, { sectionName: "", teacher: "" }],
    }));
  };

  const removeSection = (index: number) => {
    setForm((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = () => {
  const payload = {
    name: form.className,
    category: form.category,
    academicYear: form.academicYear,
    sections: form.sections.map((s) => ({
      sectionName: s.sectionName,
      teacher: s.teacher || null,
    })),
  };

  createClass.mutate(payload, {
   onSuccess: () => {
  toast.success("Class created successfully!");

  queryClient.invalidateQueries({ queryKey: ["classes"] });
  queryClient.refetchQueries({ queryKey: ["classes"] });

  onSuccess?.();
},
    onError: (error: any) => {
      console.log("ERROR 👉", error?.response?.data);
      toast.error(error?.response?.data?.message || "Failed to create class");
    },
  });
};

return (
  <div className="bg-white">
    <div className="px-10 py-8">
      <h3 className="mb-6 text-[13px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        Class Details
      </h3>

      <div className="space-y-6">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-900">
            Class Name
          </label>
          <input
            value={form.className}
              onChange={(e) => updateField("className", e.target.value)}
            placeholder="e.g. Grade 12"
            className="h-12 w-full rounded-md border border-slate-300 bg-white px-4 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-900">
            Category
          </label>
          <select
            value={form.category}
            onChange={(e) => updateField("category", e.target.value)}
            className="h-12 w-full mb-6 rounded-md border border-slate-300 bg-white px-4 text-sm text-slate-900 shadow-sm outline-none"
          >
            <option value="">Select category</option>
            <option value="PRIMARY_SCHOOL">Primary School</option>
            <option value="SECONDARY_SCHOOL">Secondary School</option>
            <option value="HIGHER_SECONDARY">Higher Secondary</option>
          </select>
        </div>
      </div>

      <div className="mt-9 mb-4 flex items-center justify-between">
        <h3 className="text-[13px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          Sections & Teachers
        </h3>

        <button
          type="button"
          onClick={addSection}
          className="flex items-center gap-2 text-sm font-semibold"
          style={{ color: "#0f2f5f" }}
        >
          <Plus size={15} />
          Add Section
        </button>
      </div>

      <div className="space-y-4">
        {form.sections.map((section, index) => (
          <div
            key={index}
            className="rounded-xl border border-slate-200 bg-slate-100 px-5 py-4 shadow-sm"
          >
            <div className="mb-4 flex items-center justify-between">
              <span
                className="rounded-full px-4 py-1 text-xs font-semibold text-white shadow-sm"
                style={{ backgroundColor: "#0f2f5f" }}
              >
                {section.sectionName || `Section ${index + 1}`}
              </span>

              <button
                type="button"
                onClick={() => removeSection(index)}
                className="text-red-500"
              >
                <Trash2 size={15} />
              </button>
            </div>

            <select
              value={section.teacher}
              onChange={(e) => updateSection(index, "teacher", e.target.value)}
              className="h-11 w-full rounded-md border border-slate-300 bg-white px-4 text-sm text-slate-800 shadow-sm outline-none"
            >
              <option value="">Assign Class Teacher</option>
              <option value="teacher-1">Teacher 1</option>
              <option value="teacher-2">Teacher 2</option>
            </select>
          </div>
        ))}
      </div>

      <div className="mt-7 border-t border-slate-200 pt-6">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onCancel}
            className="text-sm font-semibold uppercase tracking-widest text-slate-400"
          >
            ‹ Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={createClass.isPending}
            className="h-12 min-w-[190px] rounded-lg px-7 text-xs font-semibold uppercase tracking-widest text-white shadow-lg disabled:opacity-60"
            style={{ backgroundColor: "#0f172a" }}
          >
            {createClass.isPending ? "Creating..." : "Create Class"}
          </button>
        </div>
      </div>
    </div>
  </div>
);

};