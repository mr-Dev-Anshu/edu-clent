export interface AcademicYear {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  isLocked: boolean;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateAcademicYearDto = Omit<
  AcademicYear,
  "id" | "tenantId" | "createdAt" | "updatedAt"
>;

export type UpdateAcademicYearDto = Partial<CreateAcademicYearDto>;
