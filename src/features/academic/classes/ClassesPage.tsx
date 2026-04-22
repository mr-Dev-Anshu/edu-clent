"use client";

import {
  AvatarCircle,
  ConfirmDialog,
  DataTable,
  FilterBar,
  MetricCard,
  PageHeader,
} from "@/common/components/shared";
import { useConfirm } from "@/hooks/useConfirm";
import { useDataTable } from "@/hooks/useDataTable";
import { FilterField, TableColumn } from "@/types";
import { useMemo, useState } from "react";

import AddClassDrawer from "./components/AddClassDrawer";
import { ClassActionsMenu } from "./components/ClassActionsMenu";
import EditClassModal from "./components/EditClassModal";
import ManageSectionsModal from "./components/ManageSectionsModal";
import { classesHook } from "./hooks/useClasses";
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

  const { data: classes = [], isLoading, refetch } = classesHook.useData();
  const { mutateAsync: deleteClass } = classesHook.useRemove();

  const {
    paginated,
    total,
    page,
    pageSize,
    query,
    filters,
    sort,
    setPage,
    handleSearch,
    handleFilter,
    handleSort,
    resetFilters,
  } = useDataTable<ClassRow>({
    data: classes,
    pageSize: 10,
    searchKeys: ["name"],
  });

  const { confirm, isOpen, options, handleConfirm, handleCancel } =
    useConfirm();

  const totalClasses = classes.length;

  const totalSections = useMemo(
    () => classes.reduce((sum, c) => sum + (c.sections?.length || 0), 0),
    [classes],
  );

  const avgStudents = useMemo(() => {
    const totalSectionCount = classes.reduce(
      (sum, c) => sum + (c.sections?.length || 0),
      0,
    );

    const totalStudents = classes.reduce(
      (sum, c) => sum + (c.totalStudents || 0),
      0,
    );

    return totalSectionCount
      ? Math.round(totalStudents / totalSectionCount)
      : 0;
  }, [classes]);

  const handleEdit = (classData: ClassRow) => {
    setSelected(classData);
    setEditOpen(true);
  };

  const handleManage = (classData: ClassRow) => {
    setSelected(classData);
    setSectionsOpen(true);
  };

  const handleDelete = (classData: ClassRow) => {
    confirm({
      title: `Delete "${classData.name}"?`,
      description:
        "This will permanently delete the class and all its sections.",
      confirmLabel: "Yes, Delete",
      variant: "danger",
      onConfirm: async () => {
        await deleteClass(classData.id);
        refetch?.();
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
          <p className="font-medium text-sm text-slate-800">{row.name}</p>
          <p className="text-xs text-slate-400 capitalize">
            {row.category?.replace(/_/g, " ")}
          </p>
        </div>
      ),
    },
    {
      key: "sections",
      header: "SECTIONS",
      width: "200px",
      render: (_, row) => (
        <div className="flex flex-wrap gap-1">
          {row.sections?.slice(0, 3).map((s) => (
            <span
              key={s.id}
              className="px-2 py-0.5 text-xs rounded-full bg-blue-50 text-blue-700 font-medium"
            >
              {s.name}
            </span>
          ))}

          {row.sections?.length > 3 && (
            <span className="text-xs text-slate-400">
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
          {row.teachers?.slice(0, 3).map((t) => (
            <AvatarCircle
              key={t.id}
              name={t.name}
              imageUrl={t.avatarUrl}
              size="sm"
            />
          ))}

          {row.teachers?.length > 3 && (
            <span className="text-xs text-slate-500 ml-3">
              +{row.teachers.length - 3}
            </span>
          )}
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
    <div className="p-6">
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
            <button className="h-9 px-4 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
              Bulk Import
            </button>

            <button
              onClick={() => setAddOpen(true)}
              className="h-9 px-4 rounded-lg bg-[#1E3A5F] text-white text-sm font-medium hover:bg-[#152d4a] transition-colors"
            >
              + Add New Class
            </button>
          </>
        }
      />

      <div className="grid grid-cols-3 gap-4 mb-6">
        <MetricCard data={{ label: "TOTAL CLASSES", value: totalClasses }} />
        <MetricCard data={{ label: "TOTAL SECTIONS", value: totalSections }} />
        <MetricCard
          data={{ label: "AVG STUDENTS/SECTION", value: avgStudents }}
        />
      </div>

      <DataTable
        data={paginated as unknown as Record<string, unknown>[]}
        columns={columns as unknown as TableColumn<Record<string, unknown>>[]}
        total={total}
        page={page}
        pageSize={pageSize}
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

      <AddClassDrawer
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSuccess={() => refetch?.()}
      />

      <EditClassModal
        open={editOpen}
        data={selected}
        onClose={() => setEditOpen(false)}
        onSuccess={() => refetch?.()}
      />

      <ManageSectionsModal
        open={sectionsOpen}
        classData={selected}
        onClose={() => setSectionsOpen(false)}
        onSuccess={() => refetch?.()}
      />

      <ConfirmDialog
        isOpen={isOpen}
        options={options}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
}
