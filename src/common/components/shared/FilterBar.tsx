import React from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';

export interface FilterConfig {
  id: string;
  label: string;
  type: 'text' | 'select';
  placeholder?: string;
  width?: string;
  options?: { label: string; value: string }[];
  defaultValue?: string;
  value?: string;
}

interface FilterBarProps {
  configs: FilterConfig[];
  onFilterChange: (id: string, value: string) => void;
  onApplyFilters?: () => void;
  showApplyButton?: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({ 
  configs = [], 
  onFilterChange, 
  onApplyFilters,
  showApplyButton = true 
}) => {
  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/60 px-5 py-4 mb-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <div className="flex items-end gap-5 flex-wrap">
        {configs.map((field) => (
          <div 
            key={field.id} 
            className="flex flex-col gap-2"
            style={{ width: field.width ?? (field.type === 'text' ? '260px' : '190px') }}
          >
            {/* Label with subtle styling */}
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.05em] ml-1">
              {field.label}
            </label>

            <div className="relative group">
              {field.type === "text" ? (
                <>
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-200">
                    <Search size={18} strokeWidth={2.5} />
                  </div>
                  <input
                    type="text"
                    placeholder={field.placeholder}
                    onChange={(e) => onFilterChange(field.id, e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-50/50 border border-slate-100 rounded-xl text-[13.5px] font-semibold text-slate-700 placeholder:text-slate-400 placeholder:font-medium focus:bg-white focus:border-blue-500/40 focus:ring-4 focus:ring-blue-500/5 focus:outline-none transition-all duration-300"
                  />
                </>
              ) : (
                <div className="relative">
                  <select
                    {...(field.value !== undefined ? { value: field.value } : { defaultValue: field.defaultValue })}
                    onChange={(e) => onFilterChange(field.id, e.target.value)}
                    className="w-full pl-4 pr-10 py-2.5 bg-slate-50/50 border border-slate-100 rounded-xl text-[13.5px] font-semibold text-slate-700 appearance-none focus:bg-white focus:border-blue-500/40 focus:ring-4 focus:ring-blue-500/5 focus:outline-none cursor-pointer transition-all duration-300"
                  >
                    {field.options?.map((opt) => (
                      <option key={opt.value} value={opt.value} className="font-medium">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-slate-600 transition-colors">
                    <ChevronDown size={18} strokeWidth={2.5} />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Apply Filters Button - Primary Style */}
        {showApplyButton && (
          <div className="flex-shrink-0">
            <button
              onClick={onApplyFilters}
              className="flex items-center justify-center gap-2 px-7 py-2.5 bg-[#0F172A] hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-all duration-300 shadow-[0_4px_14px_0_rgba(15,23,42,0.3)] active:scale-95 hover:-translate-y-0.5"
            >
              <Filter size={16} strokeWidth={2.5} />
              <span>Apply Filters</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};