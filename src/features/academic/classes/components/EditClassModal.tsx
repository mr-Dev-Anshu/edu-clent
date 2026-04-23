import api from "@/lib/axios/index";
import { useEffect, useState } from "react";
import { EditClassModalProps } from "../types";

export default function EditClassModal({
  open,
  data,
  onClose,
  onSuccess,
}: EditClassModalProps) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data) {
      setName(data.name || "");
    }
  }, [data]);

  const resetForm = () => {
    setName("");
  };

  const handleClose = () => {
    resetForm();
    onClose?.();
  };

  const updateClass = async () => {
    const finalName = name.trim();

    if (!finalName) {
      alert("Class name is required");
      return;
    }

    try {
      setLoading(true);

      await api.patch(`/api/v1/classes/${data?.id}`, {
        name: finalName,
      });

      resetForm();
      onSuccess?.();
      onClose?.();
    } catch (error: any) {
      console.error(error);
      alert(error?.response?.data?.message || "Unable to update class");
    } finally {
      setLoading(false);
    }
  };

  if (!open || !data) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={handleClose} />

      <div className="fixed inset-0 z-50 flex justify-center items-center px-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-800">Edit Class</h2>

            <button
              onClick={handleClose}
              className="w-9 h-9 rounded-full hover:bg-slate-100 text-xl"
            >
              ✕
            </button>
          </div>

          <input
            className="border border-slate-300 rounded-lg p-3 w-full mb-6"
            placeholder="Enter class name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="flex-1 h-11 rounded-lg border border-slate-300"
            >
              Cancel
            </button>

            <button
              onClick={updateClass}
              disabled={loading || !name.trim()}
              className="flex-1 h-11 rounded-lg bg-[#1E3A5F] text-white disabled:opacity-60"
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
