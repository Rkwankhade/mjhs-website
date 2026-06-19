import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const notice = await prisma.notice.findUnique({ where: { id: params.id } });
  if (!notice) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(notice);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const notice = await prisma.notice.update({ where: { id: params.id }, data: { ...body, publishedAt: body.status === 'PUBLISHED' ? new Date() : undefined } });
  return NextResponse.json(notice);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await prisma.notice.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
