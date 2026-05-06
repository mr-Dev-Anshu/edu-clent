"use client";

import React from "react";

export const SectionHeader = ({
  className,
  academicYearName,
  isCurrentAcademicYear,
}: {
  className: string;
  academicYearName: string;
  isCurrentAcademicYear: boolean;
}) => {
  return (
    <div className="text-left">
      <p className="text-[11px] uppercase tracking-wide text-slate-900 font-semibold">{className}</p>
      <div className="flex items-center gap-2 mt-1 flex-wrap">
        <p className="text-sm text-slate-600">{academicYearName}</p>
        {isCurrentAcademicYear && (
          <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
            Current
          </span>
        )}
      </div>
    </div>
  );
};
