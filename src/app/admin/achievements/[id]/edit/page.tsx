import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { AchievementForm } from '@/components/admin/achievement-form';
export default async function EditAchievementPage({ params }: { params: { id: string } }) {
  const a = await prisma.achievement.findUnique({ where: { id: params.id } });
  if (!a) notFound();
  return <AchievementForm achievement={JSON.parse(JSON.stringify(a))} mode="edit" />;
}
