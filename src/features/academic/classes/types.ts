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
  category: "primary" | "secondary" | "higher_secondary";
  totalStudents: number;
  sections: Section[];
  teachers: Teacher[];
  academicYear?: string;
}

export interface CreateClassPayload {
  name: string;
  category: string;
  sections: Array<{ name: string; teacherId?: string }>;
}

// addin new

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
