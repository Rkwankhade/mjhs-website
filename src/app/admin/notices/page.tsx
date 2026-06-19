import { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/admin/data-table';
import { ConfirmDelete } from '@/components/admin/confirm-delete';
import { Pencil, Eye } from 'lucide-react';

export const metadata: Metadata = { title: 'Notices – Admin' };

export default async function AdminNoticesPage() {
  const notices = await prisma.notice.findMany({ orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }] });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-navy">Notices</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage school notices and announcements</p>
      </div>
      <DataTable
        data={notices}
        searchKeys={['title', 'category']}
        createHref="/admin/notices/new"
        createLabel="New Notice"
        columns={[
          { key: 'title', label: 'Title', render: n => <span className="font-medium line-clamp-1 max-w-xs">{n.title}</span> },
          { key: 'category', label: 'Category', render: n => <Badge variant="outline" className="text-xs">{n.category}</Badge> },
          { key: 'status', label: 'Status', render: n => <Badge className={n.status === 'PUBLISHED' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200'} variant="outline">{n.status}</Badge> },
          { key: 'isPinned', label: 'Pinned', render: n => n.isPinned ? '📌' : '—' },
          { key: 'viewCount', label: 'Views', render: n => <span className="flex items-center gap-1 text-muted-foreground"><Eye className="h-3.5 w-3.5" />{n.viewCount}</span> },
          { key: 'publishedAt', label: 'Published', render: n => <span className="text-xs text-muted-foreground">{n.publishedAt ? new Date(n.publishedAt).toLocaleDateString('en-IN') : '—'}</span> },
        ]}
        actions={n => (
          <div className="flex items-center gap-1 justify-end">
            <Link href={`/admin/notices/${n.id}/edit`}><Button variant="ghost" size="sm" className="h-8 w-8 p-0"><Pencil className="h-4 w-4" /></Button></Link>
            <ConfirmDelete id={n.id} entity="Notice" apiPath="/api/notices" />
          </div>
        )}
      />
    </div>
  );
}
