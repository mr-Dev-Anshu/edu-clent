import { apiKernel } from '@/config/apiKernel';
import { kernelHook } from '@/hooks/useKernel';

export interface Class {
  id: string;
  classCode: string;
  className: string;
  category: string; // PRIMARY_SCHOOL | SECONDARY_SCHOOL | HIGHER_SECONDARY
  academicYear?: string;
  sections: Section[];
  classTeachers: ClassTeacher[];
  totalStudents: number;
}

export interface Section {
  id: string;
  sectionName: string;
  assignedTeacher?: {
    id?: string;
    name: string;
    avatar?: string | null;
  };
}

export interface ClassTeacher {
  id: string;
  user: {
    firstName: string;
    lastName: string;
    avatar?: string;
  };
}

const classKernel = apiKernel<Class>('/classes/with-sections/all');

export const useClasses = kernelHook<Class, any, any>('classes', classKernel);