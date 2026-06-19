import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function GET() {
  const session = await auth();
  if (!session || (session.user as any).role !== 'SUPER_ADMIN')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const users = await prisma.admin.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true, name: true, email: true, phone: true,
      role: true, status: true, createdAt: true, updatedAt: true,
    },
  });
  return NextResponse.json(users);
}
