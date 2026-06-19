import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
export async function GET() {
  const albums = await prisma.galleryAlbum.findMany({ include: { _count: { select: { images: true } } }, orderBy: [{ order: 'asc' }, { createdAt: 'desc' }] });
  return NextResponse.json(albums);
}
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const album = await prisma.galleryAlbum.create({ data: { ...body, eventDate: body.eventDate ? new Date(body.eventDate) : null } });
  return NextResponse.json(album, { status: 201 });
}
