import axios from "axios";
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

  const handleSubmit = async () => {
    try {
      setLoading(true);

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/classes`,
        {
          name,
          numericLevel: getNumericLevel(),
          description: category,
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

  const handleClose = () => {
    resetForm();
    onClose?.();
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={handleClose} />

      <div className="fixed top-0 right-0 h-full w-112.5 bg-white shadow-2xl z-50 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-800">
            Add New Class
          </h2>

          <button
            onClick={handleClose}
            className="w-9 h-9 rounded-full hover:bg-slate-100 text-xl"
          >
            ✕
          </button>
        </div>

        <input
          className="border border-slate-300 rounded-lg p-3 w-full mb-4"
          placeholder="Enter class name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <select
          className="border border-slate-300 rounded-lg p-3 w-full mb-6"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="primary">Primary</option>
          <option value="secondary">Secondary</option>
          <option value="higher_secondary">Higher Secondary</option>
        </select>

        <div className="flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 h-11 rounded-lg border border-slate-300"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading || !name.trim()}
            className="flex-1 h-11 rounded-lg bg-[#1E3A5F] text-white disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </>
  );
}
