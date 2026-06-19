import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { FacultyForm } from '@/components/admin/faculty-form';
export default async function EditFacultyPage({ params }: { params: { id: string } }) {
  const f = await prisma.faculty.findUnique({ where: { id: params.id } });
  if (!f) notFound();
  return <FacultyForm faculty={JSON.parse(JSON.stringify(f))} mode="edit" />;
}
