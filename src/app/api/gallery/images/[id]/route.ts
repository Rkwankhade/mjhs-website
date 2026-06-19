import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  if (body.isCover && body.albumId) {
    await prisma.galleryImage.updateMany({ where: { albumId: body.albumId }, data: { isCover: false } });
  }
  const img = await prisma.galleryImage.update({ where: { id: params.id }, data: { isCover: body.isCover } });
  return NextResponse.json(img);
}
export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await prisma.galleryImage.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
