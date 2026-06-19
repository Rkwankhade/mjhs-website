import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { CreateUserForm } from '@/components/admin/create-user-form';

export default async function CreateUserPage() {
  const session = await auth();
  if (!session || (session.user as any).role !== 'SUPER_ADMIN') redirect('/admin/dashboard');
  return (
    <div className="max-w-lg">
      <h1 className="font-serif text-2xl font-bold text-navy mb-6">Create New User</h1>
      <CreateUserForm />
    </div>
  );
}
