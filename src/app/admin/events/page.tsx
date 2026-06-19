import { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/admin/data-table';
import { ConfirmDelete } from '@/components/admin/confirm-delete';
import { Pencil } from 'lucide-react';
export const metadata: Metadata = { title: 'Events – Admin' };
export default async function AdminEventsPage() {
  const events = await prisma.event.findMany({ orderBy: { startDate: 'desc' } });
  return (
    <div className="space-y-6">
      <div><h1 className="font-serif text-2xl font-bold text-navy">Events</h1><p className="text-sm text-muted-foreground mt-1">Manage school events and programs</p></div>
      <DataTable data={events} searchKeys={['title','category']} createHref="/admin/events/new" createLabel="New Event"
        columns={[
          { key: 'title', label: 'Title', render: e => <span className="font-medium line-clamp-1 max-w-xs">{e.title}</span> },
          { key: 'category', label: 'Category', render: e => <Badge variant="outline" className="text-xs">{e.category}</Badge> },
          { key: 'status', label: 'Status', render: e => <Badge variant="outline" className={e.status==='UPCOMING'?'border-blue-300 text-blue-700':e.status==='ONGOING'?'border-green-300 text-green-700':''}>{e.status}</Badge> },
          { key: 'startDate', label: 'Date', render: e => <span className="text-xs text-muted-foreground">{new Date(e.startDate).toLocaleDateString('en-IN')}</span> },
          { key: 'venue', label: 'Venue', render: e => <span className="text-xs text-muted-foreground">{e.venue || '—'}</span> },
        ]}
        actions={e => (
          <div className="flex items-center gap-1 justify-end">
            <Link href={`/admin/events/${e.id}/edit`}><Button variant="ghost" size="sm" className="h-8 w-8 p-0"><Pencil className="h-4 w-4" /></Button></Link>
            <ConfirmDelete id={e.id} entity="Event" apiPath="/api/events" />
          </div>
        )} />
    </div>
  );
}
