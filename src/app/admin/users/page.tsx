import { Metadata } from 'next';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { UsersTable } from '@/components/admin/users-table';

export const metadata: Metadata = { title: 'User Management – Admin' };

export default async function UsersPage() {
  const session = await auth();
  if (!session || (session.user as any).role !== 'SUPER_ADMIN') {
    redirect('/admin/dashboard');
  }

  const users = await prisma.admin.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true, name: true, email: true, phone: true,
      role: true, status: true, createdAt: true,
    },
  });

  const currentUserId = (session.user as any).id;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-navy">User Management</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Approve, block, or manage staff access to the admin panel.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Users',   value: users.length,                                         color: 'bg-navy/5 border-navy/10 text-navy' },
          { label: 'Active',        value: users.filter(u => u.status === 'ACTIVE').length,      color: 'bg-green-50 border-green-100 text-green-700' },
          { label: 'Pending',       value: users.filter(u => u.status === 'PENDING').length,     color: 'bg-yellow-50 border-yellow-100 text-yellow-700' },
          { label: 'Blocked',       value: users.filter(u => u.status === 'BLOCKED').length,     color: 'bg-red-50 border-red-100 text-red-600' },
        ].map(card => (
          <div key={card.label} className={`rounded-xl border p-4 ${card.color}`}>
            <div className="text-2xl font-bold">{card.value}</div>
            <div className="text-xs font-medium mt-0.5">{card.label}</div>
          </div>
        ))}
      </div>

      <UsersTable users={JSON.parse(JSON.stringify(users))} currentUserId={currentUserId} />
    </div>
  );
}
