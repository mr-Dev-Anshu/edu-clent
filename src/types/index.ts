// src/types/index.ts

// ─── Status ──────────────────────────────────────────────────────────────────

export type StatusVariant =
  | "active" | "inactive" | "suspended" | "archived" | "onboarding"
  | "pending" | "trialing" | "draft" | "scheduled" | "expired"
  | "approved" | "enrolled" | "rejected" | "waitlisted" | "converted"
  | "present" | "absent" | "late" | "half_day" | "on_leave"
  | "verified" | "overdue" | "paid" | "partially_paid" | "canceled" | "waived"
  | "confirmed" | "probation" | "notice_period" | "resigned" | "terminated"
  | "computed" | "locked" | "in_progress" | "submitted" | "published" | "complete"
  | "not_started" | "past_due";

// ─── Tenant ───────────────────────────────────────────────────────────────────

export interface TenantConfig {
  id: string;
  name: string;
  subdomain: string;
  logoUrl?: string;
  themeConfig: {
    primaryColor: string;
    secondaryColor: string;
    borderRadius: string;
    fontFamily: string;
  };
  settings: {
    currency: string;
    timezone: string;
    dateFormat: string;
    academicYear: string;
    fiscalYearStart: string;
    language: string;
    gradingSystem: string;
    attendanceMode: "daily" | "period";
  };
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export type UserType =
  | "super_admin" | "school_owner" | "principal"
  | "teacher" | "student" | "parent" | "staff";

export interface CurrentUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  userType: UserType;
  avatarUrl?: string;
  permissions: string[];
}

// ─── Table ────────────────────────────────────────────────────────────────────

export interface TableColumn<T = Record<string, unknown>> {
  key: string;
  header: string;
  width?: string;
  sortable?: boolean;
  align?: "left" | "center" | "right";
  render?: (value: unknown, row: T, index: number) => React.ReactNode;
}

export interface SortState {
  key: string;
  direction: "asc" | "desc";
}

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

// ─── Filter ───────────────────────────────────────────────────────────────────

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterField {
  key: string;
  label: string;
  type: "search" | "select" | "date" | "daterange";
  placeholder?: string;
  options?: FilterOption[];
  width?: string;
}

// ─── Metric ───────────────────────────────────────────────────────────────────

export interface MetricCardData {
  label: string;
  value: string | number;
  icon?: React.ElementType;
  trend?: {
    value: number;
    direction: "up" | "down";
    positive: boolean;
  };
  accentVariant?: "default" | "success" | "warning" | "danger" | "info";
  suffix?: string;
  href?: string;
}

// ─── Navigation ───────────────────────────────────────────────────────────────

export interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  permission?: string;
  badge?: number;
  children?: Omit<NavItem, "children">[];
}

// ─── Confirm Dialog ───────────────────────────────────────────────────────────

export interface ConfirmOptions {
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "default";
  onConfirm: () => void | Promise<void>;
}

// ─── Generic API Response ─────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  meta?: {
    page: number;
    pageSize: number;
    total: number;
  };
  error?: string;
}