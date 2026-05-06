"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { useHeader } from "@/hooks/useHeader";
import { EmptyState } from "@/common/components/shared";

const enrollmentHeaderConfig = {
  moduleName: "Classes Directory",
  items: [
    { label: "All Classes", href: "/platform/classes" },
    { label: "Sections", href: "/platform/classes/sections" },
    { label: "Enrollments", href: "/platform/classes/enrollments" },
  ],
  actions: [],
};

const SectionEnrolmentPage = () => {
  const searchParams = useSearchParams();
  const className = searchParams.get("className") || "Class";
  const sectionName = searchParams.get("sectionName") || "Section";
  const academicYearName = searchParams.get("academicYearName") || "Academic Year";

  useHeader(enrollmentHeaderConfig, () => {});

  return (
    <div className="space-y-6 p-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Enrollment Context
            </p>
            <h1 className="text-xl font-bold text-slate-900">
              {className} - {sectionName}
            </h1>
            <p className="text-sm text-slate-600">{academicYearName}</p>
          </div>
        </div>
      </div>

      <EmptyState
        title="Enrollment page coming soon"
        description="This is a dummy page for now. Student enrollment table will be added here next."
      />
    </div>
  );
};

export default SectionEnrolmentPage;
