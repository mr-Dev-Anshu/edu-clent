// src/components/shared/SectionCard.tsx
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionCardProps {
  title?: string;
  description?: string;
  headerSlot?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  noPadding?: boolean;
}

export const SectionCard = ({
  title,
  description,
  headerSlot,
  children,
  className,
  bodyClassName,
  noPadding = false,
}: SectionCardProps) => {
  const hasHeader = title || description || headerSlot;

  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-slate-100 overflow-hidden",
        className
      )}
    >
      {hasHeader && (
        <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-slate-100">
          <div className="flex flex-col gap-0.5 min-w-0">
            {title && (
              <h2 className="text-sm font-semibold text-slate-800 leading-tight">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-xs text-slate-500">{description}</p>
            )}
          </div>
          {headerSlot && (
            <div className="flex items-center gap-2 shrink-0">
              {headerSlot}
            </div>
          )}
        </div>
      )}
      <div className={cn(!noPadding && "p-5", bodyClassName)}>
        {children}
      </div>
    </div>
  );
};