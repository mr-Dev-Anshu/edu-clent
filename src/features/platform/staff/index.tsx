"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  BookOpen,
  Eye,
  GraduationCap,
  LayoutGrid,
  MoreVertical,
  Search,
  Trash2,
  Upload,
  Users,
  X,
  Edit2,
} from "lucide-react";
import { useHeader } from "@/hooks/useHeader";
import { Modal } from "@/common/components/shared";
import { useClasses } from "./services/ClassService";
import { ClassEnrollment } from "./components/ClassEnrollments";
import {
  DeleteClassModal,
  EditClassModal,
  ManageSectionsModal,
} from "./components/ClassModals";
import { headerConfig } from "./constant/CONFIG_DATA";

const ClassActionsDropdown = ({
  row,
  onEdit,
  onManageSections,
  onViewStudents,
  onDelete,
}: any) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative flex justify-end" ref={ref}>
      <button
        onClick={() => setOpen((p) => !p)}
        className="rounded-lg p-2 text-slate-700 hover:bg-slate-100"
      >
        <MoreVertical size={18} />
      </button>

      {open && (
        <div className="absolute right-0 top-9 z-50 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl">
          <button onClick={() => onEdit(row)} className="flex w-full items-center gap-3 px-4 py-2.5 text-sm hover:bg-slate-50">
            <Edit2 size={14} /> Edit Class
          </button>
          <button onClick={() => onManageSections(row)} className="flex w-full items-center gap-3 px-4 py-2.5 text-sm hover:bg-slate-50">
            <LayoutGrid size={14} /> Manage Sections
          </button>
          <button onClick={() => onViewStudents(row)} className="flex w-full items-center gap-3 px-4 py-2.5 text-sm hover:bg-slate-50">
            <Eye size={14} /> View Students
          </button>
          <div className="mx-2 border-t border-slate-100" />
          <button onClick={() => onDelete(row)} className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
            <Trash2 size={14} /> Delete Class
          </button>
        </div>
      )}
    </div>
  );
};

const ClassesPage = () => {
  const [page, setPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<any>(null);
  const [sectionsTarget, setSectionsTarget] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [filters, setFilters] = useState({ search: "", category: "" });

  const pageSize = 6;

  const { data: classResponse, isLoading, isFetching } =
    useClasses.usePaginatedData(page, pageSize, filters);

  const classes = Array.isArray(classResponse?.data) ? classResponse.data : [];
  const total = classResponse?.total ?? classes.length;

  const totalClasses = classResponse?.meta?.totalClasses ?? total ?? 0;
  const totalSections =
    classResponse?.meta?.totalSections ??
    classes.reduce((sum: number, item: any) => sum + (item.sections?.length || 0), 0);

  const avgStudentsPerSection =
    classResponse?.meta?.avgStudentsPerSection ??
    (totalSections ? Math.round(classes.reduce((sum: number, item: any) => sum + (item.totalStudents || 0), 0) / totalSections) : 0);

  useHeader(headerConfig, (eventName) => {
    if (eventName === "CLASS_ADD") setIsAddModalOpen(true);
  });

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="min-h-screen bg-[#f4f7fb] p-6">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <div className="mb-3 flex items-center gap-2 text-sm text-slate-500">
            <span>Console</span>
            <span>›</span>
            <span>Academic</span>
            <span>›</span>
            <span className="font-semibold text-[#061a40]">Classes & Sections</span>
          </div>
          <h1 className="text-3xl font-semibold text-[#061a40]">Classes & Sections</h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage institutional academic structures and student distribution.
          </p>
        </div>

        <div className="flex gap-3">
          <button className="flex h-11 items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 text-sm font-medium text-[#061a40]">
            <Upload size={15} />
            Bulk Import
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex h-11 items-center gap-2 rounded-lg bg-[#061a40] px-5 text-sm font-semibold text-white shadow-sm"
          >
            + Add New Class
          </button>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-3 gap-6">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="flex justify-between">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-700">Total Classes</p>
            <GraduationCap className="text-slate-200" size={44} />
          </div>
          <h2 className="mt-3 text-4xl font-bold text-[#061a40]">{totalClasses}</h2>
          <p className="mt-4 text-xs font-semibold text-green-600">
            {classResponse?.meta?.classGrowth ?? ""}
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="flex justify-between">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-700">Total Sections</p>
            <BookOpen className="text-slate-200" size={42} />
          </div>
          <h2 className="mt-3 text-4xl font-bold text-[#061a40]">{totalSections}</h2>
          <p className="mt-4 text-xs text-slate-700">
            {classResponse?.meta?.sectionStatus ?? ""}
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="flex justify-between">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-700">Avg Students/Section</p>
            <Users className="text-slate-200" size={44} />
          </div>
          <h2 className="mt-3 text-4xl font-bold text-[#061a40]">{avgStudentsPerSection}</h2>
          <p className="mt-4 text-xs font-semibold text-red-600">
            {classResponse?.meta?.overCapacitySections ? `${classResponse.meta.overCapacitySections} sections over capacity` : ""}
          </p>
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between rounded-xl bg-white/70 p-4 shadow-sm">
        <div className="flex gap-4">
          <div className="flex h-11 w-[330px] items-center gap-3 rounded-lg bg-white px-4 shadow-sm">
            <Search size={16} className="text-slate-500" />
            <input
              value={filters.search}
              onChange={(e) => {
                setFilters((p) => ({ ...p, search: e.target.value }));
                setPage(1);
              }}
              placeholder="Search by class name..."
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>

          <select
            value={filters.category}
            onChange={(e) => {
              setFilters((p) => ({ ...p, category: e.target.value }));
              setPage(1);
            }}
            className="h-11 rounded-lg bg-white px-4 text-sm shadow-sm outline-none"
          >
            <option value="">Category: All</option>
            <option value="PRIMARY_SCHOOL">Primary School</option>
            <option value="SECONDARY_SCHOOL">Secondary School</option>
            <option value="HIGHER_SECONDARY">Higher Secondary</option>
          </select>

          <button
            onClick={() => setFilters({ search: "", category: "" })}
            className="text-sm font-medium text-[#0f3b73]"
          >
            Clear All
          </button>
        </div>

        <p className="text-sm text-slate-700">
          Displaying {classes.length} of {total} results
        </p>
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-200 text-left text-sm uppercase tracking-[0.18em] text-slate-900">
              <th className="px-6 py-5">Class Name</th>
              <th className="px-6 py-5">Sections</th>
              <th className="px-6 py-5">Class Teachers</th>
              <th className="px-6 py-5">Total Students</th>
              <th className="px-6 py-5 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {isLoading || isFetching ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-sm text-slate-500">
                  Loading classes...
                </td>
              </tr>
            ) : classes.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-sm text-slate-500">
                  No classes found. Add a class to show data here.
                </td>
              </tr>
            ) : (
              classes.map((item: any) => (
                <tr key={item.id} className="border-t border-slate-100">
                  <td className="px-6 py-5">
                    <p className="font-semibold text-[#061a40]">{item.className}</p>
                    <p className="mt-1 text-xs uppercase text-slate-500">
                      {item.category?.replace(/_/g, " ")}
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex flex-wrap gap-2">
                      {(item.sections || []).slice(0, 4).map((section: any, index: number) => (
                        <span
                          key={section.id || index}
                          className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-[#0f3b73]"
                        >
                          {section.sectionName}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex -space-x-2">
                      {(item.classTeachers || []).slice(0, 3).map((teacher: any, index: number) => (
                        <div
                          key={teacher.id || index}
                          className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-slate-200 text-xs font-bold text-slate-700"
                        >
                          {teacher.user?.avatar ? (
                            <img src={teacher.user.avatar} alt="" className="h-full w-full object-cover" />
                          ) : (
                            `${teacher.user?.firstName?.[0] || ""}${teacher.user?.lastName?.[0] || ""}`
                          )}
                        </div>
                      ))}
                    </div>
                  </td>

                  <td className="px-6 py-5 text-base font-medium text-slate-900">
                    {item.totalStudents ?? 0}
                  </td>

                  <td className="px-6 py-5">
                    <ClassActionsDropdown
                      row={item}
                      onEdit={setEditTarget}
                      onManageSections={setSectionsTarget}
                      onViewStudents={(r: any) => console.log("View students:", r.id)}
                      onDelete={setDeleteTarget}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="flex items-center justify-between bg-slate-50 px-6 py-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="text-sm text-slate-500 disabled:opacity-40"
          >
            ‹ Previous
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: Math.min(totalPages, 3) }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`h-9 w-9 rounded text-sm ${
                  page === i + 1 ? "bg-[#061a40] text-white" : "text-slate-700"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="text-sm text-[#061a40] disabled:opacity-40"
          >
            Next ›
          </button>
        </div>
      </div>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Class"
        className="max-w-5xl"
      >
        <ClassEnrollment
          onCancel={() => setIsAddModalOpen(false)}
          onSuccess={() => setIsAddModalOpen(false)}
        />
      </Modal>

      {editTarget && (
        <EditClassModal
          isOpen={!!editTarget}
          onClose={() => setEditTarget(null)}
          classData={editTarget}
        />
      )}

      {sectionsTarget && (
        <ManageSectionsModal
          isOpen={!!sectionsTarget}
          onClose={() => setSectionsTarget(null)}
          classData={sectionsTarget}
        />
      )}

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