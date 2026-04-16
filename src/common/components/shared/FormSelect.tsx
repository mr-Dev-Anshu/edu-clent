// src/components/shared/FormSelect.tsx
import { forwardRef, SelectHTMLAttributes } from "react";
import { FieldError } from "react-hook-form";
import { ChevronDown } from "lucide-react";
import { FilterOption } from "@/types";
import { cn } from "@/lib/utils";

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: FilterOption[];
  placeholder?: string;
  error?: FieldError;
  helperText?: string;
  required?: boolean;
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ label, options, placeholder, error, helperText, required, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-700 leading-none">
          {label}
          {required && <span className="text-red-500 ml-1" aria-hidden>*</span>}
        </label>

        <div className="relative">
          <select
            ref={ref}
            className={cn(
              "w-full h-9 pl-3 pr-8 rounded-lg border text-sm appearance-none",
              "focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F]",
              "transition-colors cursor-pointer",
              error
                ? "border-red-400 bg-red-50 text-red-800"
                : "border-slate-200 bg-white text-slate-800 hover:border-slate-300",
              className
            )}
            aria-invalid={!!error}
            {...props}
          >
            {placeholder && (
              <option value="">{placeholder}</option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
        </div>

        {error && (
          <p className="text-xs text-red-500">{error.message}</p>
        )}
        {helperText && !error && (
          <p className="text-xs text-slate-400">{helperText}</p>
        )}
      </div>
    );
  }
);

FormSelect.displayName = "FormSelect";