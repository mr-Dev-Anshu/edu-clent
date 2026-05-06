/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { useAppSelector } from "@/hooks/useStore";
import { selectAuthUser } from "@/features/auth/slice";
import Sidebar from "@/common/components/main/Sidebar";
import DashboardHeader from "@/common/components/shared/DashboardHeader";
import { PLATFORM_SIDEBAR } from "@/config/sideBarConfig";
import * as Icons from "lucide-react";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

const PlatformLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const user = useAppSelector(selectAuthUser);
  const { moduleName, items, actions } = useAppSelector(
    (state) => state.header,
  );

  const mappedNavItems = items.map((item) => {
    const isMatch = pathname.startsWith(item.href);
    const isMoreSpecificMatch = items.some(
      (otherItem) =>
        otherItem.href !== item.href &&
        pathname.startsWith(otherItem.href) &&
        otherItem.href.length > item.href.length,
    );
    const isActive = isMatch && !isMoreSpecificMatch;
    return {
      ...item,
      isActive,
    };
  });
  const mappedActions = actions.map((action) => ({
    ...action,
    icon: action.iconName ? (Icons as any)[action.iconName] : undefined,
    onClick: () => {
      if (action.disabled) {
        toast.error(action.disabledReason || "This action is not available right now.");
        return;
      }

      const event = new CustomEvent("header-action-trigger", {
        detail: { eventName: action.emitEvent },
      });
      window.dispatchEvent(event);
    },
  }));

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar items={PLATFORM_SIDEBAR} />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <DashboardHeader
          moduleName={moduleName || "Dashboard"}
          headerNavItems={mappedNavItems}
          actions={mappedActions}
          onSearchChange={(val) => console.log("Search:", val)}
        />

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default PlatformLayout;