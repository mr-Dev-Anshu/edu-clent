import api from "@/lib/axios/index";
import { useState } from "react";
import { AddClassDrawerProps } from "../types";

export default function AddClassDrawer({
  open,
  onClose,
  onSuccess,
}: AddClassDrawerProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("primary");
  const [loading, setLoading] = useState(false);

  const getNumericLevel = () => {
    if (category === "primary") return 1;
    if (category === "secondary") return 6;
    return 11;
  };

  const resetForm = () => {
    setName("");
    setCategory("primary");
  };

  const handleClose = () => {
    resetForm();
    onClose?.();
  };

  const handleSubmit = async () => {
    const finalName = name.trim();

    if (!finalName) {
      alert("Class name is required");
      return;
    }

    try {
      setLoading(true);

      await api.post("/api/v1/classes", {
        name: finalName,
        numericLevel: getNumericLevel(),
        description: category,
      });

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
        className="fixed inset-0 z-40 bg-[#022448]/20 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div className="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white shadow-[0_12px_32px_rgba(2,36,72,0.08)] ring-1 ring-slate-200/40 p-6 flex flex-col">
        <div className="flex items-center justify-between pb-5 border-b border-slate-100">
          <div>
            <h2 className="text-[22px] font-medium tracking-tight text-slate-900">
              Add New Class
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Create a new academic class structure.
            </p>
          </div>

          <button
            onClick={handleClose}
            className="h-9 w-9 rounded-full text-slate-500 hover:bg-slate-100 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 py-6 space-y-5">
          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-slate-500 mb-2">
              Class Name
            </label>

            <input
              className="h-11 w-full rounded-xl bg-[#F7F9FB] px-4 text-sm text-slate-800 outline-none ring-1 ring-slate-200/40 focus:ring-[#1E3A5F]/30"
              placeholder="Enter class name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-slate-500 mb-2">
              Category
            </label>

            <select
              className="h-11 w-full rounded-xl bg-[#F7F9FB] px-4 text-sm text-slate-800 outline-none ring-1 ring-slate-200/40 focus:ring-[#1E3A5F]/30"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="primary">Primary</option>
              <option value="secondary">Secondary</option>
              <option value="higher_secondary">Higher Secondary</option>
            </select>
          </div>
        </div>

        <div className="pt-5 border-t border-slate-100 flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 h-11 rounded-xl bg-white text-sm font-medium text-slate-700 ring-1 ring-slate-200/40 hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading || !name.trim()}
            className="flex-1 h-11 rounded-xl bg-gradient-to-br from-[#022448] to-[#1E3A5F] text-sm font-medium text-white shadow-sm hover:shadow-md transition-all disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Class"}
          </button>
        </div>
      </div>
    </>
  );
}
