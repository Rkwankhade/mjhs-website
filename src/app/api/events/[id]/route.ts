import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const event = await prisma.event.update({ where: { id: params.id }, data: { ...body, startDate: new Date(body.startDate), endDate: body.endDate ? new Date(body.endDate) : null } });
  return NextResponse.json(event);
}
export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await prisma.event.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
