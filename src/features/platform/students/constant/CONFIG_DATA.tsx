import { FilterConfig } from "@/common/components/shared/FilterBar";
import { StatusBadge } from "@/common/components/shared";
import { formatDate } from "@/lib/formator";
import { TableColumn } from "@/types";
import { Calendar, UserCheck, Users } from "lucide-react";
import { StudentType } from "../types";

export const TABLE_COLUMNS: TableColumn<StudentType>[] = [
  {
    header: "Admission No.",
    key: "admissionNumber",
    width: "160px",
    sortable: true,
    render: (value) => (
      <span className="inline-block rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-[11px] font-bold text-slate-600">
        {String(value)}
      </span>
    ),
  },
  {
    header: "Student Name",
    key: "firstName",
    render: (_value, row) => (
      <div className="flex flex-col">
        <span className="text-[13px] font-semibold text-slate-900">
          {row.firstName} {row.lastName}
        </span>
        <span className="text-[11px] text-slate-400">
          {row.classId} / {row.sectionId}
        </span>
      </div>
    ),
  },
  {
    header: "Gender",
    key: "gender",
    render: (value) => (
      <span className="capitalize text-[12px] font-medium text-slate-600">
        {String(value)}
      </span>
    ),
  },
  {
    header: "Date of Birth",
    key: "dateOfBirth",
    width: "150px",
    render: (value) => (
      <span className="text-[12px] text-slate-600">
        {formatDate(String(value))}
      </span>
    ),
  },
  {
    header: "Status",
    key: "status",
    width: "140px",
    render: (_value, row) => (
      <StatusBadge
        status={row.status === "transferred" ? "inactive" : row.status}
        label={row.status === "transferred" ? "Transferred" : undefined}
        dot
        size="sm"
      />
    ),
  },
  {
    header: "Class",
    key: "classId",
    width: "120px",
    render: (value) => (
      <span className="text-[12px] font-medium text-slate-600">
        {String(value)}
      </span>
    ),
  },
  {
    header: "Section",
    key: "sectionId",
    width: "120px",
    render: (value) => (
      <span className="text-[12px] font-medium text-slate-600">
        {String(value)}
      </span>
    ),
  },
  {
    header: "Created At",
    key: "createdAt",
    width: "150px",
    render: (value) => (
      <span className="text-[12px] text-slate-600">
        {formatDate(String(value))}
      </span>
    ),
  },
];

export const FILTER_CONFIGS: FilterConfig[] = [
  {
    id: "gender",
    label: "Gender",
    type: "select",
    defaultValue: "all",
    options: [
      { label: "All Genders", value: "all" },
      { label: "Male", value: "male" },
      { label: "Female", value: "female" },
      { label: "Other", value: "other" },
    ],
  },
  {
    id: "status",
    label: "Status",
    type: "select",
    defaultValue: "all",
    options: [
      { label: "All Statuses", value: "all" },
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
      { label: "Transferred", value: "transferred" },
    ],
  },
  {
    id: "classId",
    label: "Class",
    type: "text",
    placeholder: "Filter by class ID",
    width: "220px",
  },
];

export const ENROLLMENT_STEPS = [
  {
    id: "personal-info",
    sectionTitle: "Personal Info",
    description: "Capture the student's basic identity and login details.",
    fields: [
      {
        id: "firstName",
        label: "First Name *",
        type: "text",
        gridCols: 6,
        validation: { required: "First name is required" },
      },
      {
        id: "lastName",
        label: "Last Name *",
        type: "text",
        gridCols: 6,
        validation: { required: "Last name is required" },
      },
      {
        id: "email",
        label: "Email *",
        type: "email",
        gridCols: 6,
        validation: {
          required: "Email is required",
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "Invalid email address",
          },
        },
      },
      {
        id: "password",
        label: "Password *",
        type: "password",
        gridCols: 6,
        validation: {
          required: "Password is required",
          minLength: {
            value: 8,
            message: "Password must be at least 8 characters long",
          },
        },
      },
      {
        id: "dateOfBirth",
        label: "Date of Birth *",
        type: "date",
        gridCols: 6,
        validation: { required: "Date of birth is required" },
      },
      {
        id: "gender",
        label: "Gender *",
        type: "select",
        options: ["male", "female", "other"],
        gridCols: 6,
        validation: { required: "Please select a gender" },
      },
    ],
  },
  {
    id: "academic-info",
    sectionTitle: "Academic Info",
    description: "Assign the student to the correct academic records.",
    fields: [
      {
        id: "admissionNumber",
        label: "Admission Number *",
        type: "text",
        gridCols: 12,
        validation: { required: "Admission number is required" },
      },
      {
        id: "classId",
        label: "Class ID *",
        type: "text",
        gridCols: 6,
        validation: { required: "Class ID is required" },
      },
      {
        id: "sectionId",
        label: "Section ID *",
        type: "text",
        gridCols: 6,
        validation: { required: "Section ID is required" },
      },
    ],
  },
];

export const ANALYSIS_CARDS = [
  {
    id: "totalStudents",
    header: "Total Students",
    footer: "Total records returned by the student directory",
    icon: Users,
    variant: "primary" as const,
  },
  {
    id: "activeStudents",
    header: "Active Students",
    footer: "Active records visible on the current page",
    icon: UserCheck,
    variant: "white" as const,
  },
  {
    id: "newThisMonth",
    header: "New This Month",
    footer: "New admissions visible on the current page",
    icon: Calendar,
    variant: "accent" as const,
  },
  {
    id: "inactiveStudents",
    header: "Inactive",
    footer: "Inactive records visible on the current page",
    icon: Users,
    variant: "white" as const,
  },
];

export const STUDENT_HEADER_CONFIG = {
  moduleName: "Students",
  items: [{ label: "Directory", href: "/platform/students" }],
  actions: [
    {
      label: "Add Student",
      variant: "primary" as const,
      emitEvent: "add-student",
      permission: "create:students",
    },
  ],
};
