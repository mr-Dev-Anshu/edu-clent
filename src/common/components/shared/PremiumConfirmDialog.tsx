"use client";

import { cn } from "@/lib/utils";
import { ConfirmOptions } from "@/types";
import { AlertTriangle, Info, X } from "lucide-react";

interface PremiumConfirmDialogProps {
  isOpen: boolean;
  options: ConfirmOptions | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const PremiumConfirmDialog = ({
  isOpen,
  options,
  onConfirm,
  onCancel,
}: PremiumConfirmDialogProps) => {
  if (!isOpen || !options) return null;

  const isDanger = options.variant === "danger";
  const isWarning = options.variant === "warning";

  return (
    <>
      <div className="fixed inset-0 z-50 bg-[#455F87]/32 backdrop-blur-md" />

      <div className="fixed inset-0 z-60 flex items-center justify-center px-4">
        <div className="relative w-full max-w-105 overflow-hidden rounded-2xl bg-white shadow-[0_12px_32px_rgba(2,36,72,0.08)]">
          <button
            onClick={onCancel}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={15} />
          </button>

          <div className="px-6 pt-7 pb-6 text-center">
            <div
              className={cn(
                "mx-auto flex h-12 w-12 items-center justify-center rounded-xl",
                isDanger && "bg-[#FDECEC]",
                isWarning && "bg-[#FFF3CD]",
                !isDanger && !isWarning && "bg-[#EAF2FF]",
              )}
            >
              {isDanger || isWarning ? (
                <AlertTriangle
                  size={22}
                  className={cn(
                    isDanger && "text-[#C81E1E]",
                    isWarning && "text-[#856404]",
                  )}
                />
              ) : (
                <Info size={22} className="text-[#226296]" />
              )}
            </div>

            <h3 className="mt-4 text-[22px] font-medium tracking-tight text-[#191C1E]">
              {options.title}
            </h3>

            <p className="mt-2 text-[14px] leading-6 text-slate-600">
              {options.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 bg-[#F7F9FB] px-6 py-4">
            <button
              onClick={onCancel}
              className="h-10 rounded-xl border border-slate-200 bg-white text-sm font-medium text-[#191C1E] hover:bg-slate-50"
            >
              {options.cancelLabel ?? "Cancel"}
            </button>

            <button
              onClick={onConfirm}
              className={cn(
                "h-10 rounded-xl text-sm font-medium text-white",
                isDanger
                  ? "bg-[#D31313] hover:bg-[#BC1111]"
                  : isWarning
                    ? "bg-[#C48A00] hover:bg-[#A97700]"
                    : "bg-linear-to-br from-[#022448] to-[#1E3A5F]",
              )}
            >
              {options.confirmLabel ?? "Confirm"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
