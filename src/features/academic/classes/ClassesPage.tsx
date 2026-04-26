"use client";

import {
  AvatarCircle,
  DataTable,
  FilterBar,
  MetricCard,
  PageHeader,
} from "@/common/components/shared";
import { PremiumConfirmDialog } from "@/common/components/shared/PremiumConfirmDialog";
import { useConfirm } from "@/hooks/useConfirm";
import { useDataTable } from "@/hooks/useDataTable";
import { FilterField, TableColumn } from "@/types";
import { useMemo, useState } from "react";

import AddClassDrawer from "./components/AddClassDrawer";
import { ClassActionsMenu } from "./components/ClassActionsMenu";
import EditClassModal from "./components/EditClassModal";
import ManageSectionsModal from "./components/ManageSectionsModal";

import { classesHook } from "./hooks/useClasses";
import { useClassesWithSections } from "./hooks/useClassesWithSections";

import { ClassRow } from "./types";

const CATEGORY_FILTER_OPTIONS = [
  { label: "All", value: "" },
  { label: "Primary School", value: "primary" },
  { label: "Secondary School", value: "secondary" },
  { label: "Higher Secondary", value: "higher_secondary" },
];

const CLASS_FILTER_FIELDS: FilterField[] = [
  {
    key: "search",
    label: "Search",
    type: "search",
    placeholder: "Search by class name...",
    width: "240px",
  },
  {
    key: "category",
    label: "Category",
    type: "select",
    options: CATEGORY_FILTER_OPTIONS,
    width: "160px",
  },
];

export function ClassesPage() {
  const [selected, setSelected] = useState<ClassRow | null>(null);

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [sectionsOpen, setSectionsOpen] = useState(false);

  const [page, setPage] = useState(1);
  const limit = 10;

  const { mutateAsync: deleteClass } = classesHook.useRemove();

  const { data: rawClasses = [], isLoading } = useClassesWithSections();

  const classes = useMemo<ClassRow[]>(
    () =>
      rawClasses.map((item) => ({
        ...item,
        category: item.description,
        sections: item.sections ?? [],
        teachers: item.teachers ?? [],
        totalStudents: item.totalStudents ?? 0,
      })),
    [rawClasses],
  );

  const total = classes.length;

  const {
    paginated,
    query,
    filters,
    sort,
    handleSearch,
    handleFilter,
    handleSort,
    resetFilters,
  } = useDataTable<ClassRow>({
    data: classes,
    pageSize: limit,
    searchKeys: ["name"],
  });

  const { confirm, isOpen, options, handleConfirm, handleCancel } =
    useConfirm();

  const totalClasses = total;

  const totalSections = useMemo(() => {
    return classes.reduce((sum, item) => sum + (item.sections?.length ?? 0), 0);
  }, [classes]);

  const avgStudents = useMemo(() => {
    if (totalSections === 0) return 0;

    const totalStudents = classes.reduce(
      (sum, item) => sum + (item.totalStudents ?? 0),
      0,
    );

    return Math.round(totalStudents / totalSections);
  }, [classes, totalSections]);

  const handleEdit = (row: ClassRow) => {
    setSelected(row);
    setEditOpen(true);
  };

  const handleManage = (row: ClassRow) => {
    setSelected(row);
    setSectionsOpen(true);
  };

  const handleDelete = (row: ClassRow) => {
    confirm({
      title: `Delete "${row.name}"?`,
      description:
        "This will permanently delete the class and all its sections.",
      confirmLabel: "Yes, Delete",
      variant: "danger",
      onConfirm: async () => {
        await deleteClass(row.id);
      },
    });
  };

  const columns: TableColumn<ClassRow>[] = [
    {
      key: "name",
      header: "CLASS NAME",
      width: "220px",
      render: (_, row) => (
        <div>
          <p className="font-medium text-[14px] tracking-tight text-slate-800">
            {row.name}
          </p>

          <p className="text-xs text-slate-400 capitalize mt-0.5">
            {(row.description || "primary").replace(/_/g, " ")}
          </p>
        </div>
      ),
    },
    {
      key: "sections",
      header: "SECTIONS",
      width: "220px",
      render: (_, row) => (
        <div className="flex flex-wrap gap-1.5">
          {row.sections.slice(0, 3).map((section) => (
            <span
              key={section.id}
              className="px-2.5 py-1 text-xs rounded-full bg-[#EEF4FF] text-[#1E3A5F] font-medium"
            >
              {section.name}
            </span>
          ))}

          {row.sections.length > 3 && (
            <span className="text-xs text-slate-400 self-center">
              +{row.sections.length - 3}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "teachers",
      header: "CLASS TEACHERS",
      width: "160px",
      render: (_, row) => (
        <div className="flex -space-x-2">
          {row.teachers.slice(0, 3).map((teacher) => (
            <AvatarCircle
              key={teacher.id}
              name={teacher.name}
              imageUrl={teacher.avatarUrl}
              size="sm"
            />
          ))}
        </div>
      ),
    },
    {
      key: "totalStudents",
      header: "TOTAL STUDENTS",
      width: "130px",
      sortable: true,
    },
    {
      key: "actions",
      header: "ACTIONS",
      width: "80px",
      align: "center",
      render: (_, row) => (
        <ClassActionsMenu
          classData={row}
          onEdit={handleEdit}
          onManage={handleManage}
          onDelete={handleDelete}
        />
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#F7F9FB] p-6 space-y-6">
      <PageHeader
        title="Classes & Sections"
        description="Manage academic structures and student distribution."
        breadcrumbs={[
          { label: "Console", href: "/" },
          { label: "Academic", href: "/academic" },
          { label: "Classes & Sections" },
        ]}
        actions={
          <>
            <button className="h-9 px-4 rounded-lg bg-white text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200/40 hover:bg-slate-50 transition-all">
              Bulk Import
            </button>

            <button
              onClick={() => setAddOpen(true)}
              className="h-9 px-4 rounded-lg bg-linear-to-br from-[#022448] to-[#1E3A5F] text-white text-sm font-medium shadow-sm hover:shadow-md transition-all"
            >
              + Add New Class
            </button>
          </>
        }
      />

      <div className="grid grid-cols-3 gap-4">
        <MetricCard data={{ label: "TOTAL CLASSES", value: totalClasses }} />

        <MetricCard data={{ label: "TOTAL SECTIONS", value: totalSections }} />

        <MetricCard
          data={{
            label: "AVG STUDENTS/SECTION",
            value: avgStudents,
          }}
        />
      </div>

      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/40 overflow-hidden">
        <DataTable
          data={paginated as unknown as Record<string, unknown>[]}
          columns={columns as unknown as TableColumn<Record<string, unknown>>[]}
          total={total}
          page={page}
          pageSize={limit}
          onPageChange={setPage}
          sort={sort}
          onSort={handleSort as (key: string) => void}
          isLoading={isLoading}
          emptyMessage='No classes found. Click "+ Add New Class" to get started.'
          headerSlot={
            <FilterBar
              fields={CLASS_FILTER_FIELDS}
              values={filters as Record<string, string>}
              onFilter={(key, value) =>
                handleFilter(key as keyof ClassRow, value)
              }
              onSearch={handleSearch}
              searchValue={query}
              onReset={resetFilters}
              hasActiveFilters={!!query || Object.values(filters).some(Boolean)}
            />
          }
        />
      </div>

      <AddClassDrawer
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSuccess={() => setAddOpen(false)}
      />

      <EditClassModal
        open={editOpen}
        data={selected}
        onClose={() => setEditOpen(false)}
        onSuccess={() => setEditOpen(false)}
      />

      <ManageSectionsModal
        open={sectionsOpen}
        classData={selected}
        onClose={() => setSectionsOpen(false)}
        onSuccess={() => setSectionsOpen(false)}
      />

      <PremiumConfirmDialog
        isOpen={isOpen}
        options={options}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
}
