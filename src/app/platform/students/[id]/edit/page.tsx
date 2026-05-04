import { StudentEditForm } from "@/features/platform/students/components/StudentEditForm";

export default async function EditStudentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <StudentEditForm studentId={id} />;
}
