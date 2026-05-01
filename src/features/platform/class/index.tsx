"use client";

import React, { useState } from "react";
import AnalysisCard from "@/common/components/shared/AnalysisCard";
import { useHeader } from "@/hooks/useHeader";
import { DataTable, FilterBar, Modal } from "@/common/components/shared";
import { Edit2, Eye, LayoutGrid, MoreVertical, Trash2 } from "lucide-react";
import { useClasses } from "./services/ClassService";
import {
  buildDashStats,
  classFilterConfigs,
  columns,
  headerConfig,
} from "./constant/CONFIG_DATA";
import { ClassEnrollment } from "./components/ClassEnrollments";
import {
  DeleteClassModal,
  EditClassModal,
  ManageSectionsModal,
} from "./components/ClassModals";
import { useRef, useEffect } from "react";



// ─── ⋮ Action Dropdown ────────────────────────────────────────────────────────
const ClassActionsDropdown = ({
  row,
  onEdit,
  onManageSections,
  onViewStudents,
  onDelete,
}: {
  row: any;
  onEdit: (row: any) => void;
  onManageSections: (row: any) => void;
  onViewStudents: (row: any) => void;
  onDelete: (row: any) => void;
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  
  const actions = [
    {
      label: "Edit Class",
      icon: <Edit2 size={14} className="text-slate-500" />,
      className: "text-slate-700",
      onClick: () => { onEdit(row); setOpen(false); },
    },
    {
      label: "Manage Sections",
      icon: <LayoutGrid size={14} className="text-slate-500" />,
      className: "text-slate-700",
      onClick: () => { onManageSections(row); setOpen(false); },
    },
    {
      label: "View Students",
      icon: <Eye size={14} className="text-slate-500" />,
      className: "text-slate-700",
      onClick: () => { onViewStudents(row); setOpen(false); },
    },
  ];

  
  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((p) => !p)}
        className="rounded-lg p-2 text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-700"
      >
        <MoreVertical size={16} />
      </button>

     {open && (
  <div className="absolute right-0 top-10 z-[9999] min-w-[300px] rounded-xl border border-slate-200 bg-white shadow-2xl">
          <p className="border-b border-slate-100 px-8 py-4 text-center text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
  Class Actions
</p>

          {actions.map((a) => (
            <button
              key={a.label}
              onClick={a.onClick}
              className={`flex w-full items-center gap-4 px-6 py-4 text-[15px] font-medium transition-colors hover:bg-slate-50 ${a.className}`}
            >
              {a.icon}
              {a.label}
            </button>
          ))}

          <div className="mx-2 my-1 border-t border-slate-100" />

          <button
            onClick={() => { onDelete(row); setOpen(false); }}
           className="flex w-full items-center gap-4 border-t border-slate-100 px-6 py-4 text-[15px] font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            <Trash2 size={14} />
            Delete Class
          </button>
        </div>
      )}
    </div>
  );
};

// ─── Main Page ─────────────────────────────────────────────────────────────────
const ClassesPage = () => {
  const [page, setPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<any>(null);
  const [sectionsTarget, setSectionsTarget] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [filters, setFilters] = useState({ search: "", category: "" });

  const pageSize = 10;

  const { data: classResponse, isLoading, isFetching } = useClasses.usePaginatedData(
    page,
    pageSize,
    filters
  );
  // console.log("DATA 👉", classResponse);

  // Build stats from API response — no hardcoded numbers
  const stats = buildDashStats({
    totalClasses: classResponse?.meta?.totalClasses ?? 0,
    totalSections: classResponse?.meta?.totalSections ?? 0,
    avgStudentsPerSection: classResponse?.meta?.avgStudentsPerSection ?? 0,
    classGrowth: classResponse?.meta?.classGrowth,
    sectionStatus: classResponse?.meta?.sectionStatus,
    overCapacitySections: classResponse?.meta?.overCapacitySections,
  });

  const handleFilterChange = (id: string, val: string) => {
    setFilters((prev) => ({ ...prev, [id]: val === "all" ? "" : val }));
    setPage(1);
  };

  useHeader(headerConfig, (eventName) => {
    if (eventName === "CLASS_BULK_IMPORT") console.log("Bulk importing...");
    if (eventName === "CLASS_ADD") setIsAddModalOpen(true);
  });

  const tableColumns = [
    ...columns.filter((c) => c.key !== "id"),
    {
      header: "Actions",
      key: "actions",
      align: "right" as const,
      render: (_: any, row: any) => (
        <ClassActionsDropdown
          row={row}
          onEdit={setEditTarget}
          onManageSections={setSectionsTarget}
          onViewStudents={(r) => console.log("View students:", r.id)}
          onDelete={setDeleteTarget}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* 1. Stats — values come from API */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <AnalysisCard key={stat.id} {...stat} />
        ))}
      </div>

      {/* 2. Filters */}
      <FilterBar
        configs={classFilterConfigs}
        onFilterChange={handleFilterChange}
        showApplyButton={false}
      />

      {/* 3. Table */}
      <DataTable
        data={classResponse?.data || []}
        columns={tableColumns}
        total={classResponse?.total || 0}
        page={page}
        pageSize={pageSize}
        onPageChange={(newPage) => setPage(newPage)}
        isLoading={isLoading || isFetching}
        emptyMessage="No classes found."
      />

      {/* 4. Add Class Modal */}
     <Modal
  isOpen={isAddModalOpen}
  onClose={() => setIsAddModalOpen(false)}
  title="Add Class"
  className="max-w-5xl"
>
  <div>
    <ClassEnrollment
      onCancel={() => setIsAddModalOpen(false)}
      onSuccess={() => setIsAddModalOpen(false)}
    />
  </div>
</Modal>

      {/* 5. Edit Modal */}
      {editTarget && (
        <EditClassModal
          isOpen={!!editTarget}
          onClose={() => setEditTarget(null)}
          classData={editTarget}
        />
      )}

      {/* 6. Manage Sections Modal */}
      {sectionsTarget && (
        <ManageSectionsModal
          isOpen={!!sectionsTarget}
          onClose={() => setSectionsTarget(null)}
          classData={sectionsTarget}
        />
      )}

      {/* 7. Delete Confirm Modal */}
      {deleteTarget && (
        <DeleteClassModal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          classData={deleteTarget}
          onConfirm={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
};

export default ClassesPage;