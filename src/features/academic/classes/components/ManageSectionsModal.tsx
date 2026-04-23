import api from "@/lib/axios/index";
import { useState } from "react";
import { ManageSectionsModalProps } from "../types";

export default function ManageSectionsModal({
  open,
  classData,
  onClose,
  onSuccess,
}: ManageSectionsModalProps) {
  const [sectionName, setSectionName] = useState("");
  const [loading, setLoading] = useState(false);

  const CURRENT_ACADEMIC_YEAR_ID = "666f3b24-d9b9-4e08-9874-9f77b91d2ebf";

  const resetForm = () => {
    setSectionName("");
  };

  const handleClose = () => {
    resetForm();
    onClose?.();
  };

  const addSection = async () => {
    const finalName = sectionName.trim();

    if (!finalName) {
      alert("Section name is required");
      return;
    }

    try {
      setLoading(true);

      await api.post("/api/v1/sections", {
        name: finalName,
        classId: classData?.id,
        academicYearId: CURRENT_ACADEMIC_YEAR_ID,
        capacity: 40,
      });

      resetForm();
      onSuccess?.();
      onClose?.();
    } catch (error: any) {
      console.error(error);
      alert(error?.response?.data?.message || "Unable to create section");
    } finally {
      setLoading(false);
    }
  };

  if (!open || !classData) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={handleClose} />

      <div className="fixed inset-0 z-50 flex justify-center items-center px-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-800">
              Manage Sections - {classData.name}
            </h2>

            <button
              onClick={handleClose}
              className="w-9 h-9 rounded-full hover:bg-slate-100 text-xl"
            >
              ✕
            </button>
          </div>

          <input
            className="border border-slate-300 rounded-lg p-3 w-full mb-6"
            placeholder="Enter section name"
            value={sectionName}
            onChange={(e) => setSectionName(e.target.value)}
          />

          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="flex-1 h-11 rounded-lg border border-slate-300"
            >
              Cancel
            </button>

            <button
              onClick={addSection}
              disabled={loading || !sectionName.trim()}
              className="flex-1 h-11 rounded-lg bg-[#1E3A5F] text-white disabled:opacity-60"
            >
              {loading ? "Saving..." : "Add Section"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
