import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { EventForm } from '@/components/admin/event-form';
export default async function EditEventPage({ params }: { params: { id: string } }) {
  const event = await prisma.event.findUnique({ where: { id: params.id } });
  if (!event) notFound();
  return <EventForm event={JSON.parse(JSON.stringify(event))} mode="edit" />;
}
