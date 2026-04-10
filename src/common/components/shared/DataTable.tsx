// src/components/shared/DataTable.tsx
"use client";

import { ReactNode } from "react";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { TableColumn, SortState } from "@/types";
import { Pagination } from "./Pagination";
import { cn } from "@/lib/utils";

interface DataTableProps<T extends Record<string, unknown>> {
  data: T[];
  columns: TableColumn<T>[];
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  sort?: SortState | null;
  onSort?: (key: string) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  emptyIcon?: ReactNode;
  headerSlot?: ReactNode;
  footerSlot?: ReactNode;
  rowClassName?: (row: T, index: number) => string;
  onRowClick?: (row: T) => void;
}

export const DataTable = <T extends Record<string, unknown>>({
  data,
  columns,
  total,
  page,
  pageSize,
  onPageChange,
  sort,
  onSort,
  isLoading = false,
  emptyMessage = "No records found.",
  emptyIcon,
  headerSlot,
  footerSlot,
  rowClassName,
  onRowClick,
}: DataTableProps<T>) => {
  return (
    <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
      {headerSlot && (
        <div className="px-4 py-3 border-b border-slate-100">
          {headerSlot}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{ width: col.width }}
                  className={cn(
                    "px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap",
                    col.align === "center" && "text-center",
                    col.align === "right"  && "text-right",
                    !col.align             && "text-left",
                    col.sortable && onSort && "cursor-pointer hover:text-slate-700 select-none"
                  )}
                  onClick={() => col.sortable && onSort?.(col.key)}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.header}
                    {col.sortable && onSort && (
                      sort?.key === col.key ? (
                        sort.direction === "asc"
                          ? <ArrowUp size={11} className="text-[#1E3A5F]" />
                          : <ArrowDown size={11} className="text-[#1E3A5F]" />
                      ) : (
                        <ArrowUpDown size={11} className="opacity-30" />
                      )
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50">
            {isLoading ? (
              Array.from({ length: pageSize }).map((_, i) => (
                <tr key={i}>
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3.5">
                      <div className="h-4 bg-slate-100 rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-16 text-center">
                  {emptyIcon && <div className="flex justify-center mb-3">{emptyIcon}</div>}
                  <p className="text-sm text-slate-400">{emptyMessage}</p>
                </td>
              </tr>
            ) : (
              data.map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    "transition-colors",
                    onRowClick && "cursor-pointer",
                    "hover:bg-slate-50/60",
                    rowClassName?.(row, rowIdx)
                  )}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        "px-4 py-3.5 text-slate-700 align-middle",
                        col.align === "center" && "text-center",
                        col.align === "right"  && "text-right"
                      )}
                    >
                      {col.render
                        ? col.render(row[col.key], row, rowIdx)
                        : (row[col.key] != null ? String(row[col.key]) : "—")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="px-4 pb-3">
        <Pagination
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={onPageChange}
        />
      </div>

      {footerSlot && (
        <div className="px-4 py-3 border-t border-slate-100 bg-slate-50">
          {footerSlot}
        </div>
      )}
    </div>
  );
};