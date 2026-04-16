// src/components/shared/FormTextarea.tsx
import { forwardRef, TextareaHTMLAttributes } from "react";
import { FieldError } from "react-hook-form";
import { cn } from "@/lib/utils";

interface FormTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: FieldError;
  helperText?: string;
  required?: boolean;
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, error, helperText, required, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-700 leading-none">
          {label}
          {required && <span className="text-red-500 ml-1" aria-hidden>*</span>}
        </label>
        <textarea
          ref={ref}
          rows={3}
          className={cn(
            "w-full px-3 py-2 rounded-lg border text-sm text-slate-800 placeholder:text-slate-400 resize-y min-h-18",
            "focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F]",
            "transition-colors",
            error
              ? "border-red-400 bg-red-50"
              : "border-slate-200 bg-white hover:border-slate-300",
            className
          )}
          aria-invalid={!!error}
          {...props}
        />
        {error    && <p className="text-xs text-red-500">{error.message}</p>}
        {helperText && !error && <p className="text-xs text-slate-400">{helperText}</p>}
      </div>
    );
  }
);

FormTextarea.displayName = "FormTextarea";