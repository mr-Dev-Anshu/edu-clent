"use client";

import React, { useEffect, useRef, useState } from "react";
import { Eye, LayoutGrid, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { DeleteClassModal, EditClassModal, ManageSectionsModal } from "./ClassModals";

interface ClassRowActionsProps {
  row: any;
}

export const ClassRowActions = ({ row }: ClassRowActionsProps) => {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [sectionsOpen, setSectionsOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const actions = [
    {
      label: "Edit Class",
      icon: <Pencil size={14} />,
      color: "text-slate-700",
      onClick: () => { setOpen(false); setEditOpen(true); },
    },
    {
      label: "Manage Sections",
      icon: <LayoutGrid size={14} />,
      color: "text-slate-700",
      onClick: () => { setOpen(false); setSectionsOpen(true); },
    },
    {
      label: "View Students",
      icon: <Eye size={14} />,
      color: "text-slate-700",
      onClick: () => setOpen(false),
    },
    {
      label: "Delete Class",
      icon: <Trash2 size={14} />,
      color: "text-red-600",
      onClick: () => { setOpen(false); setDeleteOpen(true); },
    },
  ];

  return (
    <>
      <div className="relative flex justify-end" ref={menuRef}>
        <button
          onClick={() => setOpen((p) => !p)}
          className="rounded-lg p-2 text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-700"
        >
          <MoreVertical size={16} />
        </button>

        {open && (
          <div className="absolute right-0 top-9 z-50 w-[300px] rounded-xl border border-slate-200 bg-white py-1.5 shadow-xl">
            <p className="px-3.5 pb-2 pt-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Class Actions
            </p>
            {actions.map((a, i) => (
              <React.Fragment key={a.label}>
                {/* Divider before Delete */}
                {i === actions.length - 1 && (
                  <div className="mx-2 my-1 border-t border-slate-100" />
                )}
                <button
                  onClick={a.onClick}
                  className={`flex w-full items-center gap-2.5 px-3.5 py-2 text-[15px] font-medium ${a.color} transition-colors hover:bg-slate-50`}
                >
                  {a.icon}
                  {a.label}
                </button>
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      <EditClassModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        classData={row}
      />
      <ManageSectionsModal
        isOpen={sectionsOpen}
        onClose={() => setSectionsOpen(false)}
        classData={row}
      />
      <DeleteClassModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        classData={row}
        onConfirm={() => setDeleteOpen(false)}
      />
    </>
  );
};