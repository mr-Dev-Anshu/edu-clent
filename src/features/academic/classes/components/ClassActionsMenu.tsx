"use client";

import { Eye, MoreVertical, Pencil, Settings2, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ClassRow } from "../types";

interface ClassActionsMenuProps {
  classData: ClassRow;
  onEdit: (classData: ClassRow) => void;
  onManage: (classData: ClassRow) => void;
  onDelete: (classData: ClassRow) => void;
  onViewStudents?: (classData: ClassRow) => void;
}

export function ClassActionsMenu({
  classData,
  onEdit,
  onManage,
  onDelete,
  onViewStudents,
}: ClassActionsMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [open]);

  const closeMenu = () => setOpen(false);

  const handleEdit = () => {
    onEdit(classData);
    closeMenu();
  };

  const handleManage = () => {
    onManage(classData);
    closeMenu();
  };

  const handleDelete = () => {
    onDelete(classData);
    closeMenu();
  };

  const handleViewStudents = () => {
    onViewStudents?.(classData);
    closeMenu();
  };

  return (
    <div ref={menuRef} className="relative flex justify-center">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-[#EEF2F7] hover:text-[#022448]"
      >
        <MoreVertical size={17} />
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-50 w-62.5 overflow-hidden rounded-2xl bg-white shadow-[0_12px_32px_rgba(2,36,72,0.08)] ring-1 ring-slate-200/40">
          <div className="border-b border-slate-100 px-5 py-3">
            <p className="text-end text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8A97AB]">
              Class Actions
            </p>
          </div>

          <div className="py-1.5">
            <button
              type="button"
              onClick={handleEdit}
              className="flex h-11 w-full items-center gap-3 px-5 text-sm font-medium text-[#191C1E] transition hover:bg-[#F7F9FB]"
            >
              <Pencil size={16} className="text-slate-600" />
              Edit Class
            </button>

            <button
              type="button"
              onClick={handleManage}
              className="flex h-11 w-full items-center gap-3 px-5 text-sm font-medium text-[#191C1E] transition hover:bg-[#F7F9FB]"
            >
              <Settings2 size={16} className="text-slate-600" />
              Manage Sections
            </button>

            <button
              type="button"
              onClick={handleViewStudents}
              className="flex h-11 w-full items-center gap-3 px-5 text-sm font-medium text-[#191C1E] transition hover:bg-[#F7F9FB]"
            >
              <Eye size={16} className="text-slate-600" />
              View Students
            </button>
          </div>

          <div className="border-t border-slate-100 py-1.5">
            <button
              type="button"
              onClick={handleDelete}
              className="flex h-11 w-full items-center gap-3 px-5 text-sm font-medium text-[#C81E1E] transition hover:bg-red-50"
            >
              <Trash2 size={16} />
              Delete Class
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
