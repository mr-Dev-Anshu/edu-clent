import { apiKernel } from '@/config/apiKernel';
import { kernelHook } from '@/hooks/useKernel';

// ==================== Types ====================
export interface Class {
  id: string;
  name: string;
  numericLevel: number;
  description?: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClassTeacher {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  status: string;
}

export interface AcademicYearInfo {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  isLocked: boolean;
}

export interface Section {
  id: string;
  name: string;
  classId: string;
  academicYearId: string;
  capacity: number;
  classTeacherId?: string;
  classTeacher?: ClassTeacher;
  academicYear?: AcademicYearInfo;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClassWithSections extends Class {
  sections: Section[];
}

export interface AcademicYear {
  id: string;
  name: string;
  isCurrent: boolean;
}

export interface Enrollment {
  id: string;
  studentId: string;
  sectionId?: string;
  classId?: string;
  academicYearId: string;
  enrollmentStatus: string;
  section?: Section;
}

export interface PaginatedResponse<T> {
  success: boolean;
  total: number;
  page: number;
  limit: number;
  pages: number;
  data: T[];
}

// ==================== API Kernels ====================
const classKernel = apiKernel<Class>('/classes');
const classWithSectionsKernel = apiKernel<ClassWithSections>('/classes/with-sections');
const sectionKernel = apiKernel<Section>('/sections');
const enrollmentKernel = apiKernel<Enrollment>('/enrollments');
const academicYearKernel = apiKernel<AcademicYear>('/academic-years');

// ==================== Hooks ====================
export const useClass = kernelHook('classes', classKernel);
export const useClassWithSections = kernelHook('classes-with-sections', classWithSectionsKernel);
export const useSection = kernelHook('sections', sectionKernel);
export const useEnrollment = kernelHook('enrollments', enrollmentKernel);
export const useAcademicYear = kernelHook('academic-years', academicYearKernel);