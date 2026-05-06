// src/common/components/shared/FormBuilder.tsx
import React from 'react';
import { RegisterOptions, useFormContext } from 'react-hook-form';

interface SelectOption {
  label: string;
  value: string;
}

interface FormFieldConfig {
  id: string;
  label: string;
  type: string;
  placeholder?: string;
  validation?: RegisterOptions;
  gridCols?: number;
  disabled?: boolean;
  isLoading?: boolean;
  options?: Array<SelectOption | string>;
}

const gridConfig: Record<number, string> = {
  3: "md:col-span-3",
  4: "md:col-span-4",
  6: "md:col-span-6",
  12: "md:col-span-12",
};

export const FormField = ({ field }: { field: FormFieldConfig }) => {
  const { register, formState: { errors } } = useFormContext();
   const gridClass = gridConfig[field.gridCols] || "md:col-span-12";

  const baseInputStyles = "w-full p-3 bg-slate-50 border border-slate-100 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm disabled:cursor-not-allowed disabled:opacity-60";
  const options = field.options ?? [];

  return (
    <div className={`col-span-12 ${gridClass}`}> 
      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 tracking-wider">
        {field.label}
      </label>
      
      {field.type === 'select' ? (
        <select
          {...register(field.id, field.validation)}
          className={baseInputStyles}
          defaultValue=""
          disabled={field.disabled}
        >
          <option value="" disabled>
            {field.isLoading ? "Loading options..." : "Select an option"}
          </option>
          {options.map((opt) => {
            const val = typeof opt === 'object' ? opt.value : opt;
            const lbl = typeof opt === 'object' ? opt.label : opt;
            return <option key={val} value={val}>{lbl}</option>;
          })}
        </select>
      ) : (
        <input
          type={field.type}
          placeholder={field.placeholder}
          {...register(field.id, field.validation)}
          className={baseInputStyles}
          disabled={field.disabled}
        />
      )}
      {errors[field.id] && (
        <span className="text-[10px] text-red-500 font-medium mt-1 inline-block">
          {errors[field.id]?.message as string}
        </span>
      )}
    </div>
  );
};
