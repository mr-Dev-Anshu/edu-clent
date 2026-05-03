"use client";

import React, { useState, useRef, useEffect } from "react";
import { MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ActionMenuItem {
  label: string;
  icon: React.ElementType;
  onClick: () => void;
  variant?: "danger" | "default";
}

interface ActionMenuProps {
  actions: ActionMenuItem[];
}

export const ActionMenu = ({ actions }: ActionMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
      >
        <MoreVertical size={18} />
      </button>

      {isOpen && (
        <div className="absolute right-14 top-0 mt-1 w-48 bg-white border border-slate-100 rounded-lg shadow-xl z-50 py-1.5 flex flex-col">
          {actions.map((action, idx) => (
            <React.Fragment key={action.label}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                  action.onClick();
                }}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium transition-colors w-full text-left",
                  action.variant === "danger"
                    ? "text-red-600 hover:bg-red-50"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <action.icon
                  size={15}
                  className={
                    action.variant === "danger"
                      ? "text-red-500"
                      : "text-[#1E3A5F]"
                  }
                />
                {action.label}
              </button>
              {idx < actions.length - 1 && (
                <div className="h-px bg-slate-50 mx-2 my-0.5" />
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};
