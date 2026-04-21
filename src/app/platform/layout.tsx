"use client";
import React from 'react';

import { redirect } from 'next/navigation';
import { useAppSelector } from '@/hooks/useStore';
import { selectAuthUser } from '@/features/auth/slice';
import Sidebar from '@/common/components/main/Sidebar';
import { PLATFORM_SIDEBAR } from '@/config/sideBarConfig';

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  const user = useAppSelector(selectAuthUser);

  if (user?.roles[0]?.roleType !== 'platform') {
     // Redirection logic can also be here if not using a global AuthGuard
  }

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar items={PLATFORM_SIDEBAR} />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div>
            <h1 className="text-sm font-semibold text-slate-500 uppercase tracking-widest">
              School Management
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="text-right">
                <p className="text-sm font-bold text-slate-900">{user?.firstName}</p>
                <p className="text-[10px] text-slate-500">{user?.tenant?.name}</p>
             </div>
             <div className="w-10 h-10 rounded-full bg-[#022448] flex items-center justify-center text-white font-bold">
                {user?.firstName[0]}
             </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}