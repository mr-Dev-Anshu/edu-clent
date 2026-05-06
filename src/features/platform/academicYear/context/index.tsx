"use client";

import { createContext, useContext, ReactNode } from "react";
import { useCurrentAcademicYear as useAcademicYearQuery } from "../services/AcademicYearService";
import type { AcademicYear } from "../types";

type ContextType = {
  academicYear: AcademicYear | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
};

const AcademicYearContext = createContext<ContextType | undefined>(undefined);

export function AcademicYearProvider({ children }: { children: ReactNode }) {
  const { data, isLoading, error, refetch } = useAcademicYearQuery();

  return (
    <AcademicYearContext.Provider
      value={{
        academicYear: data || null,
        loading: isLoading,
        error: error as Error | null,
        refetch: () => refetch(),
      }}
    >
      {children}
    </AcademicYearContext.Provider>
  );
}

export function useAcademicYearContext() {
  const context = useContext(AcademicYearContext);
  if (!context) throw new Error("useAcademicYearContext must be inside AcademicYearProvider");
  return context;
}
