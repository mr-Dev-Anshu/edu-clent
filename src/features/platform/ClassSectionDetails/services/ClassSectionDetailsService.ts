import { apiKernel } from '@/config/apiKernel';
import { kernelHook } from '@/hooks/useKernel';
import { Class, Section} from "../../ClassSections/services/ClassService";


const classKernel = apiKernel<Class>('/classes');
export const useClass = kernelHook<Class, Partial<Class>, Partial<Class>>('classes', classKernel);

// Class Sections - dynamic endpoint ke liye factory function
export const useClassSections = (classId: string) => {
  const classSectionsKernel = apiKernel<Section>(`/classes/${classId}/sections`);
  return kernelHook<Section, Partial<Section>, Partial<Section>>(`class-sections-${classId}`, classSectionsKernel);
};

// ==================== Backward Compatibility Wrapper ====================
// Maintains existing API signature for consumer components
export const useClassSectionsPaginated = (
  classId: string,
  page: number,
  limit: number,
  filters?: Record<string, string>
) => {
  const { usePaginatedData } = useClassSections(classId);
  return usePaginatedData(page, limit, filters);
};

// Alias for consistency with other services
export const useClassById = (classId: string) => {
  return useClass.useSingleData(classId);
};
