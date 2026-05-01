export type StudentGender = "male" | "female" | "other";

export type StudentStatus = "active" | "inactive" | "transferred";

export interface StudentType extends Record<string, unknown> {
  id: string;
  tenantId: string;
  userId: string;
  admissionNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: StudentGender;
  classId: string;
  sectionId: string;
  status: StudentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStudentDto {
  email: string;
  password?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  admissionNumber: string;
  rollNumber?: string;
  dateOfBirth: string;
  gender: StudentGender;
  bloodGroup?: string;
  nationality?: string;
  religion?: string;
  category?: string;
  aadharNumber?: string;
  enrollmentDate?: string;
  previousSchool?: string;
  previousClass?: string;
  isStaffWard?: boolean;
  status?: StudentStatus;
  transportRequired?: boolean;
  hostelRequired?: boolean;
  medicalConditions?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  address?: string;
  city?: string;
  pincode?: string;
  classId?: string;
  sectionId?: string;
  guardians?: any[];
}

export interface UpdateStudentDto extends Partial<CreateStudentDto> {
  status?: StudentStatus;
}
