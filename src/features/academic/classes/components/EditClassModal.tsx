import axios from "axios";
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
      setName(data.name);
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
    try {
      setLoading(true);

      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/classes/${data?.id}`,
        {
          name,
        },
      );

      resetForm();
      onSuccess?.();
      onClose?.();
    } catch (error) {
      console.error(error);
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
