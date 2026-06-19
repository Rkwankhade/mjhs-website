import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
import bcrypt from 'bcryptjs';

async function guardSuperAdmin() {
  const session = await auth();
  if (!session || (session.user as any).role !== 'SUPER_ADMIN') return null;
  return session;
}

// PATCH — approve, block, change role, reset password
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await guardSuperAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const data: any = {};

  if (body.status)   data.status = body.status;
  if (body.role)     data.role   = body.role;
  if (body.password) data.password = await bcrypt.hash(body.password, 12);

  const updated = await prisma.admin.update({
    where: { id: params.id },
    data,
    select: { id: true, name: true, email: true, role: true, status: true },
  });
  return NextResponse.json(updated);
}

// DELETE — remove user (can't delete yourself)
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await guardSuperAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const me = (session.user as any).id;
  if (me === params.id)
    return NextResponse.json({ error: "You can't delete your own account." }, { status: 400 });

  await prisma.admin.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
