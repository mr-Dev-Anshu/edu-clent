import { apiKernel } from '@/config/apiKernel';
import { kernelHook } from '@/hooks/useKernel';
import { AcademicYear } from '../types';

// ==================== API Kernels ====================
const academicYearKernel = apiKernel<AcademicYear>('/academic-years');
const currentAcademicYearKernel = apiKernel<AcademicYear>('/academic-years/current');

// ==================== Hooks ====================
export const useAcademicYear = kernelHook('academic-years', academicYearKernel);
export const useCurrentAcademicYear = kernelHook('current-academic-year', currentAcademicYearKernel).useData;
