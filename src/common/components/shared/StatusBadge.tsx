import { cn } from "@/lib/utils";
import { StatusVariant } from "@/types";

// Make sure Record and < are on the same line or properly connected
const STATUS_CONFIG: Record<StatusVariant, { label: string; className: string }> = {
  // Success / positive
  active:        { label: "Active",        className: "bg-green-100 text-green-800 ring-green-200" },
  present:       { label: "Present",       className: "bg-green-100 text-green-800 ring-green-200" },
  verified:      { label: "Verified",      className: "bg-green-100 text-green-800 ring-green-200" },
  approved:      { label: "Approved",      className: "bg-green-100 text-green-800 ring-green-200" },
  enrolled:      { label: "Enrolled",      className: "bg-green-100 text-green-800 ring-green-200" },
  paid:          { label: "Paid",          className: "bg-green-100 text-green-800 ring-green-200" },
  confirmed:     { label: "Confirmed",     className: "bg-green-100 text-green-800 ring-green-200" },
  published:     { label: "Published",     className: "bg-green-100 text-green-800 ring-green-200" },
  complete:      { label: "Complete",      className: "bg-green-100 text-green-800 ring-green-200" },
  converted:     { label: "Converted",     className: "bg-green-100 text-green-800 ring-green-200" },
  // Warning / neutral
  pending:       { label: "Pending",       className: "bg-amber-100 text-amber-800 ring-amber-200" },
  trialing:      { label: "Trialing",      className: "bg-amber-100 text-amber-800 ring-amber-200" },
  draft:         { label: "Draft",         className: "bg-amber-100 text-amber-800 ring-amber-200" },
  scheduled:     { label: "Scheduled",     className: "bg-amber-100 text-amber-800 ring-amber-200" },
  late:          { label: "Late",          className: "bg-amber-100 text-amber-800 ring-amber-200" },
  half_day:      { label: "Half Day",      className: "bg-amber-100 text-amber-800 ring-amber-200" },
  partially_paid:{ label: "Partial",       className: "bg-amber-100 text-amber-800 ring-amber-200" },
  probation:     { label: "Probation",     className: "bg-amber-100 text-amber-800 ring-amber-200" },
  waitlisted:    { label: "Waitlisted",    className: "bg-amber-100 text-amber-800 ring-amber-200" },
  on_leave:      { label: "On Leave",      className: "bg-amber-100 text-amber-800 ring-amber-200" },
  onboarding:    { label: "Onboarding",    className: "bg-amber-100 text-amber-800 ring-amber-200" },
  not_started:   { label: "Not Started",   className: "bg-amber-100 text-amber-800 ring-amber-200" },
  past_due:      { label: "Past Due",      className: "bg-amber-100 text-amber-800 ring-amber-200" },
  notice_period: { label: "Notice Period", className: "bg-amber-100 text-amber-800 ring-amber-200" },
  // Danger
  suspended:     { label: "Suspended",     className: "bg-red-100 text-red-800 ring-red-200" },
  absent:        { label: "Absent",        className: "bg-red-100 text-red-800 ring-red-200" },
  overdue:       { label: "Overdue",       className: "bg-red-100 text-red-800 ring-red-200" },
  rejected:      { label: "Rejected",      className: "bg-red-100 text-red-800 ring-red-200" },
  expired:       { label: "Expired",       className: "bg-red-100 text-red-800 ring-red-200" },
  resigned:      { label: "Resigned",      className: "bg-red-100 text-red-800 ring-red-200" },
  terminated:    { label: "Terminated",    className: "bg-red-100 text-red-800 ring-red-200" },
  canceled:      { label: "Canceled",      className: "bg-red-100 text-red-800 ring-red-200" },
  // Neutral
  inactive:      { label: "Inactive",      className: "bg-slate-100 text-slate-600 ring-slate-200" },
  archived:      { label: "Archived",      className: "bg-slate-100 text-slate-600 ring-slate-200" },
  locked:        { label: "Locked",        className: "bg-slate-100 text-slate-600 ring-slate-200" },
  waived:        { label: "Waived",        className: "bg-slate-100 text-slate-600 ring-slate-200" },
  // Informational / in-progress
  in_progress:   { label: "In Progress",   className: "bg-blue-100 text-blue-800 ring-blue-200" },
  submitted:     { label: "Submitted",     className: "bg-blue-100 text-blue-800 ring-blue-200" },
  computed:      { label: "Computed",      className: "bg-blue-100 text-blue-800 ring-blue-200" },
};

interface StatusBadgeProps {
  status: StatusVariant;
  label?: string;
  dot?: boolean;
  size?: "sm" | "md";
}

export const StatusBadge = ({
  status,
  label,
  dot = false,
  size = "md",
}: StatusBadgeProps) => {
  const config = STATUS_CONFIG[status];
  
  // Good practice: Fallback in case status is missing from config
  if (!config) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium ring-1 ring-inset",
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-0.5 text-xs",
        config.className
      )}
    >
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      )}
      {label ?? config.label}
    </span>
  );
};