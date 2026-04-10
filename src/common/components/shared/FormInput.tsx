// src/components/shared/FormInput.tsx
import { forwardRef, InputHTMLAttributes } from "react";
import { FieldError } from "react-hook-form";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: FieldError;
  helperText?: string;
  suffix?: string;
  prefix?: string;
  prefixIcon?: LucideIcon;
  required?: boolean;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    { label, error, helperText, suffix, prefix, prefixIcon: PrefixIcon, required, className, ...props },
    ref
  ) => {
    const hasLeftAddon  = !!prefix || !!PrefixIcon;
    const hasRightAddon = !!suffix;

    return (
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-700 leading-none">
          {label}
          {required && <span className="text-red-500 ml-1" aria-hidden>*</span>}
        </label>

        <div className="relative flex items-center">
          {hasLeftAddon && (
            <div className="absolute left-0 flex items-center pl-3 pointer-events-none">
              {PrefixIcon
                ? <PrefixIcon size={14} className="text-slate-400" />
                : <span className="text-sm text-slate-400">{prefix}</span>}
            </div>
          )}

          <input
            ref={ref}
            className={cn(
              "w-full h-9 rounded-lg border text-sm text-slate-800 placeholder:text-slate-400",
              "focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F]",
              "transition-colors",
              error   ? "border-red-400 bg-red-50" : "border-slate-200 bg-white hover:border-slate-300",
              hasLeftAddon  ? "pl-9"  : "pl-3",
              hasRightAddon ? "pr-16" : "pr-3",
              className
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${props.id}-error` : helperText ? `${props.id}-helper` : undefined}
            {...props}
          />

          {hasRightAddon && (
            <div className="absolute right-0 flex items-center pr-3 pointer-events-none">
              <span className="text-sm text-slate-400">{suffix}</span>
            </div>
          )}
        </div>

        {error && (
          <p id={`${props.id}-error`} className="text-xs text-red-500 flex items-center gap-1">
            {error.message}
          </p>
        )}
        {helperText && !error && (
          <p id={`${props.id}-helper`} className="text-xs text-slate-400">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";