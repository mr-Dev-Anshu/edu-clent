// src/components/shared/ConfirmDialog.tsx
"use client";

import { AlertTriangle, Info, X } from "lucide-react";
import { ConfirmOptions } from "@/types";
import { cn } from "@/lib/utils";

interface ConfirmDialogProps {
  isOpen: boolean;
  options: ConfirmOptions | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog = ({
  isOpen,
  options,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  if (!isOpen || !options) return null;

  const isDanger  = options.variant === "danger";
  const isWarning = options.variant === "warning";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      role="dialog"
      aria-modal
      aria-labelledby="confirm-title"
    >
      <div className="bg-white rounded-2xl border border-slate-100 shadow-lg w-full max-w-md mx-4 p-6">
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
              isDanger  && "bg-red-100",
              isWarning && "bg-amber-100",
              !isDanger && !isWarning && "bg-blue-100"
            )}
          >
            {isDanger || isWarning ? (
              <AlertTriangle
                size={18}
                className={isDanger ? "text-red-600" : "text-amber-600"}
              />
            ) : (
              <Info size={18} className="text-blue-600" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3
              id="confirm-title"
              className="text-sm font-semibold text-slate-800 mb-1"
            >
              {options.title}
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              {options.description}
            </p>
          </div>

          <button
            onClick={onCancel}
            className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        <div className="flex items-center justify-end gap-2 mt-6">
          <button
            onClick={onCancel}
            className="h-9 px-4 rounded-lg text-sm font-medium text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            {options.cancelLabel ?? "Cancel"}
          </button>
          <button
            onClick={onConfirm}
            className={cn(
              "h-9 px-4 rounded-lg text-sm font-medium text-white transition-colors",
              isDanger
                ? "bg-red-600 hover:bg-red-700"
                : isWarning
                ? "bg-amber-600 hover:bg-amber-700"
                : "bg-[#1E3A5F] hover:bg-[#152d4a]"
            )}
          >
            {options.confirmLabel ?? "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};