// src/common/components/shared/FormBuilder.tsx
import React from 'react';
import { useFormContext } from 'react-hook-form';
const gridConfig: Record<number, string> = {
  3: "md:col-span-3",
  4: "md:col-span-4",
  6: "md:col-span-6",
  12: "md:col-span-12",
};

export const FormField = ({ field }: { field: any }) => {
  const { register, formState: { errors } } = useFormContext();
   const gridClass = gridConfig[field.gridCols] || "md:col-span-12";

  const baseInputStyles = "w-full p-3 bg-slate-50 border border-slate-100 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm";

  return (
    <div className={`col-span-12 ${gridClass}`}> 
      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 tracking-wider">
        {field.label}
      </label>
      
      {field.type === 'select' ? (
        <select {...register(field.id, field.validation)} className={baseInputStyles}>
          {field.options.map((opt: string) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      ) : (
        <input
          type={field.type}
          placeholder={field.placeholder}
          {...register(field.id, field.validation)}
          className={baseInputStyles}
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