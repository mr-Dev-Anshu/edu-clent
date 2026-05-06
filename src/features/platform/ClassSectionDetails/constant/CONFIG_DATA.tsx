import { FilterConfig } from "@/common/components/shared/FilterBar";
import { ActionMenu, ActionMenuItem } from "@/common/components/shared/ActionMenu";
import { Layers3, Trash2, Users } from "lucide-react";
import React from "react";
import { Section } from "../../ClassSections/services/ClassService";

export const sectionFilterConfigs: FilterConfig[] = [
  {
    id: "search",
    label: "Search Section",
    type: "text",
    placeholder: "Section name...",
    width: "280px",
  },
];

export const sectionEditFormSteps = [
  { id: 0, title: "Section Details", sections: ["section_edit"] },
];

export const sectionEditSectionConfig = {
  id: "section_edit",
  sectionTitle: "Section Details",
  description: "Update this section only. Class and academic year stay fixed.",
  fields: [
    {
      id: "name",
      label: "Section Name *",
      type: "text",
      placeholder: "e.g. Section A",
      gridCols: 6,
      validation: { required: "Section name is required" },
    },
    {
      id: "capacity",
      label: "Capacity *",
      type: "number",
      placeholder: "40",
      gridCols: 3,
      validation: { required: "Capacity is required" },
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

export const sectionEditFormConfig = [sectionEditSectionConfig];

export const sectionHeaderConfig = {
  moduleName: "Classes Directory",
  items: [
    { label: "All Classes", href: "/platform/classes" },
    { label: "Sections", href: "/platform/classes/sections" },
    { label: "Enrollments", href: "/platform/classes/enrollments" },
  ],
  actions: [
    {
      label: "Add Section",
      iconName: "Plus",
      variant: "primary" as const,
      emitEvent: "SECTION_ADD",
    },
  ],
};

export interface SectionTableRow extends Section {
  enrollment: string;
  classTeacherName: string;
  canManageSections?: boolean;
  manageSectionsDisabledReason?: string;
  onManageSectionsDisabledClick?: () => void;
  onActionClick?: (action: string, sectionId?: string) => void;
}

export const sectionColumns = [
  {
    header: "Section",
    key: "name",
    width: "220px",
    render: (val: string) => (
      <span className="text-[13px] font-bold text-slate-900">{val}</span>
    ),
  },
  {
    header: "Class Teacher",
    key: "classTeacherName",
    width: "220px",
    render: (val: string) => (
      <span className="text-[12px] font-medium text-slate-700">{val}</span>
    ),
  },
  {
    header: "Enrollment",
    key: "enrollment",
    width: "150px",
    render: (val: string) => (
      <span className="text-[12px] font-semibold text-slate-700">{val} Students</span>
    ),
  },
  {
    header: "Capacity",
    key: "capacity",
    width: "120px",
    render: (val: number) => (
      <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
        {val}
      </span>
    ),
  },
  {
    header: "Actions",
    key: "id",
    width: "100px",
    align: "right" as const,
    render: (_val: string, row: SectionTableRow) => {
      const actions: ActionMenuItem[] = [
        {
          label: "Manage Sections",
          icon: Layers3,
          disabled: row.canManageSections === false,
          disabledReason: row.manageSectionsDisabledReason,
          onDisabledClick: row.onManageSectionsDisabledClick,
          onClick: () => row.onActionClick?.("manage-sections", row.id),
        },
        {
          label: "View Students",
          icon: Users,
          onClick: () => row.onActionClick?.("view-students", row.id),
        },
        {
          label: "Delete Section",
          icon: Trash2,
          disabled: row.canManageSections === false,
          disabledReason: row.manageSectionsDisabledReason,
          onDisabledClick: row.onManageSectionsDisabledClick,
          onClick: () => row.onActionClick?.("delete-section", row.id),
          variant: "danger",
        },
      ];

      return <ActionMenu actions={actions} />;
    },
  },
];
