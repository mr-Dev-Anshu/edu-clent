import { apiKernel } from "@/config/apiKernel";
import { kernelHook } from "@/hooks/useKernel";

export interface AcademicYear {
  id: string;
  name: string;
  isCurrent: boolean;
}

const academicYearKernel = apiKernel<AcademicYear>("/api/v1/academic-years");

export const academicYearsHook = kernelHook(
  "academic-years",
  academicYearKernel,
);
