"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, LogOut, ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils"; // standard tailwind-merge utility
import { usePermission } from "@/hooks/usePermission";
import { SidebarItem } from "@/config/sideBarConfig";

export default function Sidebar({ items }: { items: SidebarItem[] }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const pathname = usePathname();
  const { can } = usePermission();

  const toggleSubMenu = (label: string) => {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <motion.aside
      animate={{ width: isCollapsed ? "72px" : "260px" }}
      className="h-screen bg-[#022448] text-white flex flex-col relative border-r border-white/5 shadow-2xl"
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-12 bg-[#226296] rounded-full p-1 border border-[#022448] z-50 hover:scale-110 transition-transform"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <div className="h-16 flex items-center px-5 mb-4">
        <div className="w-8 h-8 rounded-md bg-sky-400 flex items-center justify-center shrink-0">
          <span className="font-bold text-sm">S</span>
        </div>
        {!isCollapsed && (
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="ml-3 font-semibold text-sm tracking-tight">
            SOVEREIGN <span className="text-sky-400">EDU</span>
          </motion.span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto custom-scrollbar">
        {items.map((item) => {
          if (item.permission && !can(item.permission)) return null;

          const hasChildren = item.children && item.children.length > 0;
          const isMenuOpen = openMenus[item.label];
          const isActive = pathname.startsWith(item.href);

          return (
            <div key={item.label} className="space-y-1">
              {hasChildren ? (
                <button
                  onClick={() => !isCollapsed && toggleSubMenu(item.label)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all group",
                    isActive ? "bg-white/5 text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <item.icon size={18} className={cn("shrink-0", isActive && "text-sky-400")} />
                    {!isCollapsed && <span className="text-[13px] font-medium tracking-wide">{item.label}</span>}
                  </div>
                  {!isCollapsed && (
                    <ChevronDown size={14} className={cn("transition-transform cursor-pointer duration-200", isMenuOpen && "rotate-180")} />
                  )}
                </button>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2 rounded-md transition-all",
                    pathname === item.href ? "bg-blue-200 text-black shadow-lg shadow-sky-500/20" : "text-white/60 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <item.icon size={18} className="shrink-0" />
                  {!isCollapsed && <span className="text-[13px] font-medium tracking-wide">{item.label}</span>}
                </Link>
              )}

              {/* Sub-menu Items */}
              <AnimatePresence>
                {hasChildren && isMenuOpen && !isCollapsed && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden ml-4 pl-4 border-l border-white/10 space-y-1"
                  >
                    {item.children?.map((child) => {
                      if (child.permission && !can(child.permission)) return null;
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={cn(
                            "flex items-center gap-2 px-3 py-1.5 rounded-md text-[12px] transition-colors",
                            pathname === child.href ? "text-sky-400 font-semibold" : "text-white/50 hover:text-white"
                          )}
                        >
                          <child.icon size={14} />
                          {child.label}
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>

      <div className="p-4 bg-black/10 mt-auto">
        <button className="flex items-center gap-3 w-full px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
          <LogOut size={18} />
          {!isCollapsed && <span className="text-[13px] font-medium">Log out</span>}
        </button>
      </div>
    </motion.aside>
  );
}