import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
export async function GET() {
  const settings = await prisma.siteSettings.findFirst();
  return NextResponse.json(settings);
}
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const existing = await prisma.siteSettings.findFirst();
  const settings = existing
    ? await prisma.siteSettings.update({ where: { id: existing.id }, data: body })
    : await prisma.siteSettings.create({ data: body });
  return NextResponse.json(settings);
}
