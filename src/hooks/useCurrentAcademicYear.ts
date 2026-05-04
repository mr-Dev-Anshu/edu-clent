import { useAcademicYearContext } from "@/features/platform/academicYear/context";
/**
 * Access current academic year globally
 * const { academicYear, loading, error } = useCurrentAcademicYear();
 */
export function useCurrentAcademicYear() {
  return useAcademicYearContext();
}