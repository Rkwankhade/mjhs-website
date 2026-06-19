import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
export async function GET() {
  const achievements = await prisma.achievement.findMany({ orderBy: [{ year: 'desc' }, { order: 'asc' }] });
  return NextResponse.json(achievements);
}
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const a = await prisma.achievement.create({ data: body });
  return NextResponse.json(a, { status: 201 });
}
