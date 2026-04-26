import { apiKernel } from '@/config/apiKernel';
import { kernelHook } from '@/hooks/useKernel';

// 1. Define Types (As per your Backend Response)
export interface Staff {
  id: string;
  employeeCode: string;
  staffType: string;
  designation: string;
  department: string;
  joiningDate: string;
  employmentStatus: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    status: string;
  };
}

const staffKernel = apiKernel<Staff>('/staff');


export const useStaff = kernelHook<Staff, any, any>('staff', staffKernel);