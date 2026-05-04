import { StudentProfile } from "@/features/platform/students/components/StudentProfile";

export default async function StudentProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <StudentProfile studentId={id} />;
}
