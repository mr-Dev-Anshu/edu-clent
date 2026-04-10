// src/components/shared/Pagination.tsx
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  showSummary?: boolean;
}

const getPageRange = (current: number, total: number): (number | "…")[] => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4)           return [1, 2, 3, 4, 5, "…", total];
  if (current >= total - 3)   return [1, "…", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "…", current - 1, current, current + 1, "…", total];
};

export const Pagination = ({
  page,
  pageSize,
  total,
  onPageChange,
  showSummary = true,
}: PaginationProps) => {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start      = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end        = Math.min(page * pageSize, total);
  const pages      = getPageRange(page, totalPages);

  return (
    <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-1">
      {showSummary ? (
        <p className="text-sm text-slate-500 select-none">
          {total === 0
            ? "No results"
            : <>Showing <span className="font-medium text-slate-700">{start}–{end}</span> of{" "}<span className="font-medium text-slate-700">{total.toLocaleString("en-IN")}</span> results</>}
        </p>
      ) : (
        <span />
      )}

      <div className="flex items-center gap-1">
        <PageButton
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
        >
          <ChevronLeft size={13} />
        </PageButton>

        {pages.map((p, i) =>
          p === "…" ? (
            <span
              key={`ellipsis-${i}`}
              className="w-8 h-8 flex items-center justify-center text-slate-400 text-sm select-none"
            >
              …
            </span>
          ) : (
            <PageButton
              key={p}
              onClick={() => onPageChange(p)}
              active={p === page}
              aria-label={`Page ${p}`}
            >
              {p}
            </PageButton>
          )
        )}

        <PageButton
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Next page"
        >
          <ChevronRight size={13} />
        </PageButton>
      </div>
    </div>
  );
};

interface PageButtonProps {
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  children: React.ReactNode;
  "aria-label"?: string;
}

const PageButton = ({ onClick, disabled, active, children, "aria-label": ariaLabel }: PageButtonProps) => (
  <button
    onClick={onClick}
    disabled={disabled}
    aria-label={ariaLabel}
    className={cn(
      "w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors select-none",
      "border focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20",
      active
        ? "bg-[#1E3A5F] text-white border-[#1E3A5F]"
        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50",
      disabled && "opacity-40 cursor-not-allowed pointer-events-none"
    )}
  >
    {children}
  </button>
);