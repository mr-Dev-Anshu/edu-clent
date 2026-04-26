export type ClassCategory = "primary" | "secondary" | "higher_secondary";

export interface Teacher {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface Section {
  id: string;
  name: string;
  teacher?: Teacher;
  studentCount?: number;
}

export interface ClassRow {
  [key: string]: unknown;
  id: string;
  name: string;

  numericLevel: number;
  description: ClassCategory;

  // optional frontend alias (legacy support)
  category?: ClassCategory;

  totalStudents: number;

  sections: Section[];
  teachers: Teacher[];

  academicYear?: string;

  createdAt?: string;
  updatedAt?: string;
}

export interface CreateClassPayload {
  name: string;
  numericLevel: number;
  description: ClassCategory;
}

export interface UpdateClassPayload {
  name?: string;
  numericLevel?: number;
  description?: ClassCategory;
}

export interface AddClassDrawerProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export interface EditClassModalProps {
  open: boolean;
  data: ClassRow | null;
  onClose: () => void;
  onSuccess: () => void;
}

export interface ManageSectionsModalProps {
  open: boolean;
  classData: ClassRow | null;
  onClose: () => void;
  onSuccess: () => void;
}
