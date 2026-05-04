// src/common/components/shared/DynamicArrayField.tsx
import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Trash2, Plus, Info } from 'lucide-react';
import { FormField } from './FormField';

export const DynamicArrayField = ({ section }: { section: any }) => {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: section.id, 
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
          {section.sectionTitle}
        </h3>
        <span className="text-[10px] font-bold text-slate-400 uppercase">{fields.length} Items</span>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="relative group p-6 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all">
            <div className="grid grid-cols-12 gap-6 items-end">
              {section.fields.map((subField: any) => (
                <FormField 
                  key={subField.id} 
                  field={{ ...subField, id: `${section.id}.${index}.${subField.id}` }} 
                />
              ))}
              <div className="col-span-1 flex justify-end pb-2">
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => append({})}
        className="mt-4 flex items-center gap-2 px-6 py-3 border-2 border-dashed border-slate-200 rounded-xl text-indigo-600 font-bold text-xs uppercase tracking-widest hover:border-indigo-200 hover:bg-indigo-50/30 transition-all"
      >
        <Plus size={16} /> {section.addButtonLabel || "Add Item"}
      </button>

      {section.infoText && (
        <div className="mt-8 p-4 bg-indigo-50/50 rounded-xl flex gap-3 border border-indigo-50/50">
          <Info size={18} className="text-indigo-500 shrink-0" />
          <p className="text-[11px] text-indigo-700/80 leading-relaxed font-medium">
            {section.infoText}
          </p>
        </div>
      )}
    </div>
  );
};