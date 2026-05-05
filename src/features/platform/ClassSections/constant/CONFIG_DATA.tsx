import { FilterConfig } from "@/common/components/shared/FilterBar";
import { Edit2, Layers3, Trash2, Users, BookOpen, TrendingUp, Eye } from "lucide-react";
import { Section } from "../services/ClassService";
import { ActionMenu, ActionMenuItem } from "@/common/components/shared/ActionMenu";
import React from "react";

export const classFilterConfigs: FilterConfig[] = [
  {
    id: "search",
    label: "Search Class",
    type: "text",
    placeholder: "Class name or level...",
    width: "280px",
  },
  {
    id: "academicYearId",
    label: "Academic Year",
    type: "select",
    defaultValue: "current",
    width: "160px",
    options: [
      { label: "Current Year", value: "current" },
      { label: "All Years", value: "all" },
    ],
  },
];

// Action handlers configuration
export const actionHandlers = {
  editClass: (classId: string) => console.log("Edit class:", classId),
  manageSections: (classId: string) => console.log("Manage sections:", classId),
  viewStudents: (classId: string) => console.log("View students:", classId),
  deleteClass: (classId: string) => console.log("Delete class:", classId),
};

export const dashStats = [
  {
    id: 1,
    header: "Total Classes",
    data: "12",
    footer: (
      <>
        <span className="font-bold text-white">+2</span>
        <span className="opacity-80">this session</span>
      </>
    ),
    icon: BookOpen,
    variant: "primary" as const,
  },
  {
    id: 2,
    header: "Total Sections",
    data: "48",
    footer: (
      <div className="flex items-center gap-2">
        <div className="flex -space-x-1.5">
          <div className="w-5 h-5 rounded-full bg-blue-400 border border-white" />
          <div className="w-5 h-5 rounded-full bg-purple-400 border border-white" />
        </div>
        <span>Across all classes</span>
      </div>
    ),
    icon: Users,
    variant: "white" as const,
  },
  {
    id: 3,
    header: "Total Capacity",
    data: "1,920",
    footer: (
      <div className="flex items-center gap-1">
        <TrendingUp size={14} />
        <span>Student capacity</span>
      </div>
    ),
    icon: TrendingUp,
    variant: "accent" as const,
  },
];

export const headerConfig = {
  moduleName: "Classes Directory",
  items: [
    { label: "All Classes", href: "/platform/classes" },
    { label: "Sections", href: "/platform/classes/sections" },
    { label: "Enrollments", href: "/platform/classes/enrollments" },
  ],
  actions: [
    {
      label: "Bulk Import",
      iconName: "Upload",
      variant: "outline" as const,
      emitEvent: "CLASS_BULK_IMPORT",
    },
    {
      label: "Create Class",
      iconName: "Plus",
      variant: "primary" as const,
      emitEvent: "CLASS_CREATE",
    },
  ],
};

export const classColumns = [
  {
    header: "Class Name",
    key: "name",
    width: "200px",
    render: (val: string, row: ClassWithSections) => (
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold border border-indigo-100 uppercase">
          {row.numericLevel}
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-slate-900 text-[13px]">{val}</span>
          <span className="text-[11px] text-slate-400 font-medium">
            {row.description || "No description"}
          </span>
        </div>
      </div>
    ),
  },
  {
    header: "Sections",
    key: "sections",
    width: "200px",
    render: (sections: Section[]) => {
      const displaySections = sections.slice(0, 2);
      const remaining = sections.length - displaySections.length;
      
      return (
        <span className="text-[12px] font-medium flex items-center gap-1.5 flex-wrap">
          {displaySections.map((s, idx) => (
            <span key={idx} className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-100">
              {s.name}
            </span>
          ))}
          {remaining > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100">
              +{remaining}
            </span>
          )}
        </span>
      );
    },
  },
  {
    header: "Class Teacher",
    key: "classTeacher",
    width: "180px",
    render: (val: string) => (
      <span className="text-[12px] font-medium text-slate-600">
        {val || "Not Assigned"}
      </span>
    ),
  },
  {
    header: "Enrollment",
    key: "enrollment",
    width: "160px",
    render: (val: string) => (
      <span className="text-[12px] font-semibold text-slate-600">
        {val} Students
      </span>
    ),
  },
  {
    header: "Status",
    key: "status",
    width: "120px",
    render: (val: string) => (
      <span
        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${
          val === "active"
            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
            : "bg-slate-50 text-slate-600 border-slate-100"
        }`}
      >
        {val}
      </span>
    ),
  },
  {
    header: "Actions",
    key: "id",
    width: "120px",
    align: "right" as const,
    render: (
      val: string,
      row: ClassWithSections & {
        onActionClick?: (action: string, classId: string, rowData: ClassWithSections) => void;
        canManageSections?: boolean;
        manageSectionsDisabledReason?: string;
        onManageSectionsDisabledClick?: () => void;
      }
    ) => {
      const actions: ActionMenuItem[] = [
        {
          label: "View Details",
          icon: Eye,
          onClick: () => row.onActionClick?.("view", val, row as ClassWithSections),
        },
        {
          label: "Edit Class",
          icon: Edit2,
          onClick: () => row.onActionClick?.("edit", val, row as ClassWithSections),
        },
        {
          label: "Manage Sections",
          icon: Layers3,
          disabled: row.canManageSections === false,
          disabledReason: row.manageSectionsDisabledReason,
          onDisabledClick: row.onManageSectionsDisabledClick,
          onClick: () => row.onActionClick?.("manage-sections", val, row as ClassWithSections),
        },
        {
          label: "Manage Students",
          icon: Users,
          onClick: () => row.onActionClick?.("manage-students", val, row as ClassWithSections),
        },
        {
          label: "Delete",
          icon: Trash2,
          onClick: () => row.onActionClick?.("delete", val, row as ClassWithSections),
          variant: "danger",
        },
      ];
      
      return <ActionMenu actions={actions} />;
    },
  },
];

export interface ClassWithSections {
  id: string;
  name: string;
  numericLevel: number;
  description?: string;
  sections: Section[];
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export const classDetailsSectionConfig = {
  id: "step1",
  sectionTitle: "Class Details",
  description: "Create a new class with basic information.",
  fields: [
    {
      id: "name",
      label: "Class Name *",
      type: "text",
      placeholder: "e.g. 10th Grade A",
      gridCols: 6,
      validation: { required: "Class name is required" },
    },
    {
      id: "numericLevel",
      label: "Grade Level *",
      type: "number",
      placeholder: "e.g. 10",
      gridCols: 6,
      validation: { required: "Grade level is required" },
    },
    {
      id: "description",
      label: "Description",
      type: "textarea",
      placeholder: "Optional description for this class...",
      gridCols: 12,
      validation: {},
    },
  ],
};

export const sectionDetailsSectionConfig =  {
    id: "step2_details",
    sectionTitle: "Section Details",
    description: "Create a new class with basic information.",
    fields: [
    ]
  };

export const classSectionsSectionConfig = {
  
  id: "sections",
  type: "dynamic",
  sectionTitle: "Create Sections",
  description: "Add sections for this class in the current academic year.",
  addButtonLabel: "Add Section",
  defaultValue: [
    {
      name: "",
      capacity: 40,
      classTeacherId: null,
    },
  ],
  fields: [
    {
      id: "name",
      label: "Section Name",
      type: "text",
      placeholder: "e.g. A, B, C, Alpha, Beta",
      gridCols: 6,
      validation: { required: "Section name is required" },
    },
    {
      id: "capacity",
      label: "Capacity",
      type: "number",
      placeholder: "40",
      gridCols: 3,
      defaultValue: 40,
      disabled: true,
      validation: {},
    },
    {
      id: "classTeacherId",
      label: "Class Teacher",
      type: "select",
      placeholder: "Select teacher",
      gridCols: 3,
      options: [],
      validation: {},
    },
  ],
};

export const classFormConfig = [
  classDetailsSectionConfig,
  sectionDetailsSectionConfig,
  classSectionsSectionConfig,
];

export const sectionFormConfig = [
  sectionDetailsSectionConfig,
  classSectionsSectionConfig,
];

