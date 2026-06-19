import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/db';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/admin/data-table';
import { ConfirmDelete } from '@/components/admin/confirm-delete';
import { Pencil } from 'lucide-react';
export const metadata: Metadata = { title: 'Faculty – Admin' };
export default async function AdminFacultyPage() {
  const faculty = await prisma.faculty.findMany({ orderBy: [{ order: 'asc' }, { name: 'asc' }] });
  return (
    <div className="space-y-6">
      <div><h1 className="font-serif text-2xl font-bold text-navy">Faculty</h1><p className="text-sm text-muted-foreground mt-1">Manage teaching staff profiles</p></div>
      <DataTable data={faculty} searchKeys={['name','department','designation']} createHref="/admin/faculty/new" createLabel="Add Faculty"
        columns={[
          { key: 'name', label: 'Name', render: f => (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-navy/10 overflow-hidden shrink-0 flex items-center justify-center">
                {f.image ? <Image src={f.image} alt={f.name} width={32} height={32} className="object-cover"/> : <span className="text-xs font-bold text-navy">{f.name[0]}</span>}
              </div>
              <span className="font-medium text-sm">{f.name}</span>
            </div>
          )},
          { key: 'designation', label: 'Designation', render: f => <span className="text-xs text-muted-foreground">{f.designation}</span> },
          { key: 'department', label: 'Department', render: f => <Badge variant="outline" className="text-xs">{f.department}</Badge> },
          { key: 'experience', label: 'Exp.', render: f => <span className="text-xs">{f.experience} yrs</span> },
          { key: 'isActive', label: 'Status', render: f => <Badge variant="outline" className={f.isActive?'border-green-300 text-green-700':'border-red-200 text-red-600'}>{f.isActive?'Active':'Inactive'}</Badge> },
        ]}
        actions={f => (
          <div className="flex items-center gap-1 justify-end">
            <Link href={`/admin/faculty/${f.id}/edit`}><Button variant="ghost" size="sm" className="h-8 w-8 p-0"><Pencil className="h-4 w-4"/></Button></Link>
            <ConfirmDelete id={f.id} entity="Faculty" apiPath="/api/faculty" />
          </div>
        )} />
    </div>
  );
}
