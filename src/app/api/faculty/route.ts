import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
export async function GET() {
  const faculty = await prisma.faculty.findMany({ orderBy: [{ order: 'asc' }, { name: 'asc' }] });
  return NextResponse.json(faculty);
}
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const f = await prisma.faculty.create({ data: body });
  return NextResponse.json(f, { status: 201 });
}
