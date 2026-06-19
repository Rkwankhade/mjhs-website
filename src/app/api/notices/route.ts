import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const category = searchParams.get('category');
  const notices = await prisma.notice.findMany({
    where: { ...(status ? { status: status as any } : {}), ...(category ? { category: category as any } : {}) },
    orderBy: [{ isPinned: 'desc' }, { publishedAt: 'desc' }],
  });
  return NextResponse.json(notices);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const notice = await prisma.notice.create({
    data: { ...body, publishedAt: body.status === 'PUBLISHED' ? new Date() : null },
  });
  return NextResponse.json(notice, { status: 201 });
}
