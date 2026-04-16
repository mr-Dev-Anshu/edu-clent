// src/components/shared/PageHeader.tsx
import { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  actions?: ReactNode;
  className?: string;
}

export const PageHeader = ({
  title,
  description,
  breadcrumbs,
  actions,
  className,
}: PageHeaderProps) => {
  return (
    <div className={cn("flex items-start justify-between gap-4 mb-6", className)}>
      <div className="flex flex-col gap-1 min-w-0">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1 mb-1" aria-label="Breadcrumb">
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1">
                {i > 0 && <ChevronRight size={12} className="text-slate-300" />}
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-xs text-slate-500">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        <h1 className="text-xl font-semibold text-slate-800 leading-tight truncate">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-slate-500">{description}</p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-2 shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
};