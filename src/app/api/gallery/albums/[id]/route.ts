import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const album = await prisma.galleryAlbum.update({ where: { id: params.id }, data: { ...body, eventDate: body.eventDate ? new Date(body.eventDate) : null } });
  return NextResponse.json(album);
}
export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await prisma.galleryImage.deleteMany({ where: { albumId: params.id } });
  await prisma.galleryAlbum.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
