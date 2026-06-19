import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { AlbumImageManager } from '@/components/admin/album-image-manager';
export default async function AlbumDetailPage({ params }: { params: { id: string } }) {
  const album = await prisma.galleryAlbum.findUnique({ where: { id: params.id }, include: { images: { orderBy: { order: 'asc' } } } });
  if (!album) notFound();
  return <AlbumImageManager album={JSON.parse(JSON.stringify(album))} />;
}
