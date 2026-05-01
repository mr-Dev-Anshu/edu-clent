import React from "react";
import { FilterConfig } from "@/common/components/shared/FilterBar";
import { BookOpen, GraduationCap, Users } from "lucide-react";

export const columns = [
  {
    header: "Class Name",
    key: "className",
    render: (_: any, row: any) => (
      <div className="flex flex-col gap-1">
        <span className="text-[13px] font-bold text-[#0f172a]">
          {row.className || row.name || ""}
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
          {row.category?.replace(/_/g, " ") || ""}
        </span>
      </div>
    ),
  },
  {
  header: "Sections",
  key: "sections",
  render: (_: any, row: any) => (
  <div className="flex flex-wrap gap-1.5">
    {(row.sections || []).slice(0, 3).map((s: any, index: number) => (
      <span
        key={s.id || index}
        className="rounded-full bg-blue-100 px-2.5 py-1 text-[10px] font-bold text-blue-700"
      >
        {s.sectionName || s.name}
      </span>
    ))}
  </div>
)
},
  {
  header: "Class Teachers",
  key: "classTeachers",
  render: (_: any, row: any) => {
    const teachers =
      row.classTeachers ||
      row.teachers ||
      row.assignedTeachers ||
      row.sections?.flatMap((s: any) => {
        const teacher =
          s.assignedTeacher ||
          s.teacher ||
          s.classTeacher ||
          s.assignedClassTeacher;

        return teacher ? [teacher] : [];
      }) ||
      [];

    return (
      <div className="flex items-center">
        <div className="flex -space-x-2">
          {teachers.slice(0, 3).map((t: any, index: number) => {
            const user = t.user || t.teacher || t.assignedTeacher || t;
            const name =
              user.name ||
              `${user.firstName || ""} ${user.lastName || ""}`.trim();

            return (
              <div
                key={t.id || index}
                title={name}
                className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-slate-200 text-[10px] font-bold uppercase text-slate-700"
              >
                {name ? name[0] : ""}
              </div>
            );
          })}
        </div>
      </div>
    );
  },
},
  {
    header: "Total Students",
    key: "totalStudents",
    render: (val: number) => (
      <span className="text-[13px] font-bold text-slate-800">{val ?? 0}</span>
    ),
  },
];

export const classFilterConfigs: FilterConfig[] = [
  {
    id: "search",
    label: "Search by class name",
    type: "text",
    placeholder: "Search by class name...",
    width: "280px",
  },
  {
    id: "category",
    label: "Category",
    type: "select",
    defaultValue: "all",
    width: "180px",
    options: [
      { label: "All", value: "all" },
      { label: "Primary School", value: "PRIMARY_SCHOOL" },
      { label: "Secondary School", value: "SECONDARY_SCHOOL" },
      { label: "Higher Secondary", value: "HIGHER_SECONDARY" },
    ],
  },
];

export const buildDashStats = (stats: {
  totalClasses: number;
  totalSections: number;
  avgStudentsPerSection: number;
  classGrowth?: string;
  sectionStatus?: string;
  overCapacitySections?: number;
}) => [
  {
    id: 1,
    header: "Total Classes",
    data: String(stats.totalClasses ?? 0),
    footer: (
      <>
        {stats.classGrowth && (
          <span className="font-bold text-white">{stats.classGrowth}</span>
        )}
        <span className="opacity-80"> from last semester</span>
      </>
    ),
    icon: GraduationCap,
    variant: "primary" as const,
  },
  {
    id: 2,
    header: "Total Sections",
    data: String(stats.totalSections ?? 0),
    footer: <span>{stats.sectionStatus ?? "Distribution"}</span>,
    icon: BookOpen,
    variant: "white" as const,
  },
  {
    id: 3,
    header: "Avg Students/Section",
    data: String(stats.avgStudentsPerSection ?? 0),
    footer: (
      <div className="flex items-center gap-1">
        <Users size={14} />
        {stats.overCapacitySections != null &&
          stats.overCapacitySections > 0 && (
            <span className="font-semibold text-red-300">
              {stats.overCapacitySections} sections over capacity
            </span>
          )}
      </div>
    ),
    icon: Users,
    variant: "accent" as const,
  },
];

export const dashStats = buildDashStats({
  totalClasses: 0,
  totalSections: 0,
  avgStudentsPerSection: 0,
});

export const headerConfig = {
  moduleName: "Classes & Sections",
  items: [
    { label: "Classes & Sections", href: "/platform/classes" },
    { label: "Sections", href: "/platform/classes/sections" },
    { label: "Faculty", href: "/platform/classes/faculty" },
    { label: "Enrollment", href: "/platform/classes/enrollment" },
  ],
  actions: [
    {
      label: "Bulk Import",
      iconName: "Upload",
      variant: "outline" as const,
      emitEvent: "CLASS_BULK_IMPORT",
    },
    {
      label: "Add New Class",
      iconName: "Plus",
      variant: "primary" as const,
      emitEvent: "CLASS_ADD",
    },
  ],
};

export const classFormConfig = [
  {
    id: "step1",
    sectionTitle: "Class Information",
    description: "Provide the core class identity and academic category.",
    fields: [
      {
        id: "className",
        label: "Class Name *",
        type: "text",
        placeholder: "e.g. Grade 10",
        gridCols: 12,
        validation: { required: "Class name is required" },
      },
      {
        id: "category",
        label: "Category *",
        type: "select",
        options: ["PRIMARY_SCHOOL", "SECONDARY_SCHOOL", "HIGHER_SECONDARY"],
        gridCols: 12,
        validation: { required: "Please select a category" },
      },
    ],
  },
  {
    id: "step2",
    sectionTitle: "Sections",
    description: "Sections will be added manually using Add Section button.",
    fields: [],
  },
];