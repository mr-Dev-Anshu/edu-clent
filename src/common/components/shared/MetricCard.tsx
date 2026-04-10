// src/components/shared/MetricCard.tsx
import Link from "next/link";
import { TrendingDown, TrendingUp } from "lucide-react";
import { MetricCardData } from "@/types";
import { cn } from "@/lib/utils";

const ACCENT_STYLES: Record<
  NonNullable<MetricCardData["accentVariant"]>,
  { value: string; icon: string; bg: string }
> = {
  default: { value: "text-[#1E3A5F]",  icon: "text-slate-400",  bg: "bg-slate-50"  },
  success: { value: "text-green-700",   icon: "text-green-400",  bg: "bg-green-50"  },
  warning: { value: "text-amber-700",   icon: "text-amber-400",  bg: "bg-amber-50"  },
  danger:  { value: "text-red-700",     icon: "text-red-400",    bg: "bg-red-50"    },
  info:    { value: "text-blue-700",    icon: "text-blue-400",   bg: "bg-blue-50"   },
};

interface MetricCardProps {
  data: MetricCardData;
  className?: string;
}

export const MetricCard = ({ data, className }: MetricCardProps) => {
  const { label, value, icon: Icon, trend, accentVariant = "default", suffix, href } = data;
  
  const style = ACCENT_STYLES[accentVariant] ?? ACCENT_STYLES.default;

  const content = (
    <div
      className={cn(
        "rounded-lg p-5 flex flex-col gap-1.5 transition-colors border border-transparent",
        style.bg,
        href && "cursor-pointer hover:brightness-95 hover:border-slate-200",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider leading-none">
          {label}
        </span>
        {Icon && <Icon size={16} className={style.icon} />}
      </div>

      <div className="flex items-baseline gap-1.5 mt-1">
        <span className={cn("text-2xl font-semibold leading-none", style.value)}>
          {typeof value === "number" ? value.toLocaleString("en-IN") : value}
        </span>
        {suffix && (
          <span className="text-sm text-slate-400 font-medium">{suffix}</span>
        )}
      </div>

      {trend && (
        <div
          className={cn(
            "flex items-center gap-1 text-xs font-medium mt-1",
            trend.positive ? "text-green-600" : "text-red-600"
          )}
        >
          {trend.direction === "up"
            ? <TrendingUp size={12} />
            : <TrendingDown size={12} />}
          <span>{Math.abs(trend.value).toFixed(1)}%</span>
          <span className="text-slate-400 font-normal ml-0.5">vs last month</span>
        </div>
      )}
    </div>
  );

  return href ? <Link href={href} className="block no-underline">{content}</Link> : content;
};