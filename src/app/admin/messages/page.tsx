import { Metadata } from 'next';
import { prisma } from '@/lib/db';
import { Badge } from '@/components/ui/badge';
import { MessageDetail } from '@/components/admin/message-detail';
export const metadata: Metadata = { title: 'Messages – Admin' };
export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } });
  return (
    <div className="space-y-6">
      <div><h1 className="font-serif text-2xl font-bold text-navy">Messages</h1><p className="text-sm text-muted-foreground mt-1">{messages.filter(m=>m.status==='UNREAD').length} unread</p></div>
      {messages.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground border rounded-xl">No messages yet.</div>
      ) : (
        <div className="rounded-xl border bg-background overflow-hidden">
          <div className="divide-y">
            {messages.map(msg => (
              <MessageDetail key={msg.id} message={msg} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
