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
  password: string;
  firstName: string;
  lastName: string;
  admissionNumber: string;
  dateOfBirth: string;
  gender: StudentGender;
  classId: string;
  sectionId: string;
}

export interface UpdateStudentDto extends Partial<CreateStudentDto> {
  status?: StudentStatus;
}
