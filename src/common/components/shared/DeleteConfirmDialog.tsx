"use client";

import { AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  isPending?: boolean;
}

export const DeleteConfirmDialog = ({
  isOpen,
  title,
  description,
  onConfirm,
  onCancel,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  isPending = false,
}: DeleteConfirmDialogProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-confirm-title"
    >
      <div className="bg-white rounded-2xl border border-slate-100 shadow-lg w-full max-w-md mx-4 p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-red-100">
            <AlertTriangle size={18} className="text-red-600" />
          </div>

          <div className="flex-1 min-w-0">
            <h3
              id="delete-confirm-title"
              className="text-sm font-semibold text-slate-800 mb-1"
            >
              {title}
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              {description}
            </p>
          </div>

          <button
            onClick={onCancel}
            className="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            type="button"
          >
            <X size={14} />
          </button>
        </div>

        <div className="flex items-center justify-end gap-2 mt-6">
          <button
            onClick={onCancel}
            className="h-9 px-4 rounded-lg text-sm font-medium text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors"
            type="button"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className={cn(
              "h-9 px-4 rounded-lg text-sm font-medium text-white transition-colors disabled:opacity-50",
              "bg-red-600 hover:bg-red-700"
            )}
            type="button"
          >
            {isPending ? "Deleting..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};