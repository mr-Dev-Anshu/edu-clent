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
  id: string;
  name: string;

  // backend fields
  numericLevel: number;
  description: "primary" | "secondary" | "higher_secondary";

  // frontend ke liye
  category?: "primary" | "secondary" | "higher_secondary";
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
  description: "primary" | "secondary" | "higher_secondary";
}

export interface UpdateClassPayload {
  name?: string;
  numericLevel?: number;
  description?: "primary" | "secondary" | "higher_secondary";
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
