import { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/admin/data-table';
import { ConfirmDelete } from '@/components/admin/confirm-delete';
import { Pencil } from 'lucide-react';
export const metadata: Metadata = { title: 'Achievements – Admin' };
export default async function AdminAchievementsPage() {
  const achievements = await prisma.achievement.findMany({ orderBy: [{ year: 'desc' }, { order: 'asc' }] });
  return (
    <div className="space-y-6">
      <div><h1 className="font-serif text-2xl font-bold text-navy">Achievements</h1><p className="text-sm text-muted-foreground mt-1">Manage school achievements and accolades</p></div>
      <DataTable data={achievements} searchKeys={['title','studentName','category']} createHref="/admin/achievements/new" createLabel="New Achievement"
        columns={[
          { key: 'title', label: 'Title', render: a => <span className="font-medium line-clamp-1 max-w-xs">{a.title}</span> },
          { key: 'category', label: 'Category', render: a => <Badge variant="outline" className="text-xs">{a.category}</Badge> },
          { key: 'year', label: 'Year' },
          { key: 'studentName', label: 'Student', render: a => <span className="text-xs text-muted-foreground">{a.studentName || '—'}</span> },
          { key: 'level', label: 'Level', render: a => a.level ? <Badge variant="outline" className="text-xs capitalize">{a.level.toLowerCase()}</Badge> : <span>—</span> },
          { key: 'isFeatured', label: 'Featured', render: a => a.isFeatured ? '⭐' : '—' },
        ]}
        actions={a => (
          <div className="flex items-center gap-1 justify-end">
            <Link href={`/admin/achievements/${a.id}/edit`}><Button variant="ghost" size="sm" className="h-8 w-8 p-0"><Pencil className="h-4 w-4"/></Button></Link>
            <ConfirmDelete id={a.id} entity="Achievement" apiPath="/api/achievements" />
          </div>
        )} />
    </div>
  );
}
