// src/components/shared/FilterBar.tsx
"use client";

import { Search, X, ChevronDown } from "lucide-react";
import { FilterField } from "@/types";

interface FilterBarProps {
  fields: FilterField[];
  values: Record<string, string>;
  onFilter: (key: string, value: string) => void;
  onSearch?: (value: string) => void;
  searchValue?: string;
  onReset: () => void;
  actionSlot?: React.ReactNode;
  hasActiveFilters?: boolean;
}

export const FilterBar = ({
  fields,
  values,
  onFilter,
  onSearch,
  searchValue = "",
  onReset,
  actionSlot,
  hasActiveFilters = false,
}: FilterBarProps) => {
  return (
    <div className="bg-white rounded-xl border border-slate-100 px-4 py-3">
      <div className="flex items-center gap-2 flex-wrap">
        {fields.map((field) => {
          if (field.type === "search") {
            return (
              <div key={field.key} className="relative" style={{ width: field.width ?? "240px" }}>
                <Search
                  size={13}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
                <input
                  type="text"
                  placeholder={field.placeholder ?? `Search…`}
                  value={searchValue}
                  onChange={(e) => onSearch?.(e.target.value)}
                  className="w-full h-9 pl-8 pr-3 rounded-lg border border-slate-200 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F] transition-colors"
                />
              </div>
            );
          }

          if (field.type === "select" && field.options) {
            return (
              <div key={field.key} className="relative" style={{ width: field.width ?? "160px" }}>
                <select
                  value={values[field.key] ?? ""}
                  onChange={(e) => onFilter(field.key, e.target.value)}
                  className="w-full h-9 pl-3 pr-8 rounded-lg border border-slate-200 text-sm text-slate-700 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F] transition-colors cursor-pointer"
                >
                  <option value="">{field.label}</option>
                  {field.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={13}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
              </div>
            );
          }

          if (field.type === "date") {
            return (
              <input
                key={field.key}
                type="date"
                value={values[field.key] ?? ""}
                onChange={(e) => onFilter(field.key, e.target.value)}
                style={{ width: field.width ?? "160px" }}
                className="h-9 px-3 rounded-lg border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F] transition-colors"
              />
            );
          }

          return null;
        })}

        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 h-9 px-3 rounded-lg text-sm text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200"
          >
            <X size={13} />
            Reset
          </button>
        )}

        {actionSlot && (
          <div className="ml-auto flex items-center gap-2">
            {actionSlot}
          </div>
        )}
      </div>
    </div>
  );
};