import { apiKernel } from "@/config/apiKernel";
import { kernelHook } from "@/hooks/useKernel";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import {
  CreateStudentDto,
  StudentType,
  UpdateStudentDto,
  AcademicClass,
  AcademicSection,
  AcademicYear
} from "../types";

const studentKernel = apiKernel<
  StudentType,
  CreateStudentDto,
  UpdateStudentDto
>("/students");

export const useStudentService = kernelHook<
  StudentType,
  CreateStudentDto,
  UpdateStudentDto
>("students", studentKernel);

const classKernel = apiKernel<AcademicClass>("/classes");
export const useClassService = kernelHook<AcademicClass, any, any>("classes", classKernel);

const sectionKernel = apiKernel<AcademicSection>("/sections");
export const useSectionService = kernelHook<AcademicSection, any, any>("sections", sectionKernel);

const academicYearKernel = apiKernel<AcademicYear>("/academic-years");
export const useAcademicYearService = kernelHook<AcademicYear, any, any>("academic-years", academicYearKernel);

// Custom hook for section options (lightweight dropdown data)
export const useSectionOptions = (classId: string | null, academicYearId: string | null) => {
  return useQuery({
    queryKey: ["sections", "options", { classId, academicYearId }],
    queryFn: async () => {
      const response = await api.get<{ success: boolean; data: AcademicSection[] }>(
        "/sections/options",
        {
          params: { classId, academicYearId },
        }
      );
      return response.data.data;
    },
    enabled: !!classId && !!academicYearId,
    retry: 1,
  });
};
