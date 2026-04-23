"use client";

import { Eye, MoreVertical, Pencil, Settings2, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ClassRow } from "../types";

interface ClassActionsMenuProps {
  classData: ClassRow;
  onEdit: (classData: ClassRow) => void;
  onManage: (classData: ClassRow) => void;
  onDelete: (classData: ClassRow) => void;
}

export function ClassActionsMenu({
  classData,
  onEdit,
  onManage,
  onDelete,
}: ClassActionsMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const outside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    if (open) document.addEventListener("mousedown", outside);

    return () => document.removeEventListener("mousedown", outside);
  }, [open]);

  const closeMenu = () => setOpen(false);

  return (
    <div className="relative flex justify-center" ref={menuRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-[#EEF2F7] hover:text-[#022448]"
      >
        <MoreVertical size={17} />
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-50 w-[250px] overflow-hidden rounded-2xl bg-white shadow-[0_12px_32px_rgba(2,36,72,0.08)] ring-1 ring-slate-200/40">
          <div className="border-b border-slate-100 px-5 py-3">
            <p className="text-[11px] font-semibold text-end uppercase tracking-[0.14em] text-[#8A97AB]">
              Class Actions
            </p>
          </div>

          <div className="py-1.5">
            <button
              onClick={() => {
                onEdit(classData);
                closeMenu();
              }}
              className="flex h-11 w-full items-center gap-3 px-5 text-sm font-medium text-[#191C1E] transition hover:bg-[#F7F9FB]"
            >
              <Pencil size={16} className="text-slate-600" />
              Edit Class
            </button>

            <button
              onClick={() => {
                onManage(classData);
                closeMenu();
              }}
              className="flex h-11 w-full items-center gap-3 px-5 text-sm font-medium text-[#191C1E] transition hover:bg-[#F7F9FB]"
            >
              <Settings2 size={16} className="text-slate-600" />
              Manage Sections
            </button>

            <button
              onClick={closeMenu}
              className="flex h-11 w-full items-center gap-3 px-5 text-sm font-medium text-[#191C1E] transition hover:bg-[#F7F9FB]"
            >
              <Eye size={16} className="text-slate-600" />
              View Students
            </button>
          </div>

          <div className="border-t border-slate-100 py-1.5">
            <button
              onClick={() => {
                onDelete(classData);
                closeMenu();
              }}
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
