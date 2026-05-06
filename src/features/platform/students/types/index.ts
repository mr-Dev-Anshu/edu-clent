export type StudentGender = "male" | "female" | "other";

export type StudentStatus = "active" | "inactive" | "transferred";

export interface StudentGuardian {
  firstName?: string;
  lastName?: string;
  relation?: string;
  email?: string;
  phone?: string;
  occupation?: string;
  password?: string;
  isPrimaryContact?: boolean;
  canPickup?: boolean;
}

export interface StudentUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  status: string;
}

export interface StudentEnrollmentSection {
  id: string;
  name: string;
  capacity?: number;
  class: {
    id: string;
    name: string;
    numericLevel?: number;
  };
}

export interface StudentEnrollmentAcademicYear {
  id: string;
  name: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
}

export interface StudentEnrollmentData {
  id: string;
  rollNumber: string;
  enrollmentStatus: string;
  isCurrent: boolean;
  section: StudentEnrollmentSection;
  academicYear: StudentEnrollmentAcademicYear;
}

export interface StudentTenant {
  id: string;
  name: string;
  organizationType: string;
  officialEmail?: string;
  subdomain?: string;
}

export interface StudentType extends Record<string, unknown> {
  id: string;
  tenantId: string;
  userId: string;
  admissionNumber: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email?: string;
  dateOfBirth: string;
  gender: StudentGender;
  bloodGroup?: string;
  nationality?: string;
  religion?: string;
  category?: string;
  aadharNumber?: string;
  rollNumber?: string;
  academicYearId?: string;
  classId: string;
  sectionId: string;
  enrollmentDate?: string;
  previousSchool?: string;
  previousClass?: string;
  isStaffWard?: boolean;
  status: StudentStatus;
  transportRequired?: boolean;
  hostelRequired?: boolean;
  medicalConditions?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  address?: string;
  city?: string;
  pincode?: string;
  guardians?: StudentGuardian[];
  createdAt: string;
  updatedAt: string;
  // Nested objects from API response
  user?: StudentUser;
  enrollment?: StudentEnrollmentData;
  tenant?: StudentTenant;
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
  academicYearId?: string;
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
  guardians?: StudentGuardian[];
}

// Basic types for Class and Section
export interface AcademicClass {
  id: string;
  name: string;
  [key: string]: unknown;
}

export interface AcademicSection {
  id: string;
  name: string;
  classId: string;
  [key: string]: unknown;
}

export interface AcademicYear {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  [key: string]: unknown;
}

export interface UpdateStudentDto extends Partial<CreateStudentDto> {
  status?: StudentStatus;
}
