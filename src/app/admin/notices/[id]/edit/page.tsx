import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { NoticeForm } from '@/components/admin/notice-form';
export default async function EditNoticePage({ params }: { params: { id: string } }) {
  const notice = await prisma.notice.findUnique({ where: { id: params.id } });
  if (!notice) notFound();
  return <NoticeForm notice={JSON.parse(JSON.stringify(notice))} mode="edit" />;
}
