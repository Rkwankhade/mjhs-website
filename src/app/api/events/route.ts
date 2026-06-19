import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
export async function GET() {
  const events = await prisma.event.findMany({ orderBy: { startDate: 'desc' } });
  return NextResponse.json(events);
}
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const event = await prisma.event.create({ data: { ...body, startDate: new Date(body.startDate), endDate: body.endDate ? new Date(body.endDate) : null } });
  return NextResponse.json(event, { status: 201 });
}
