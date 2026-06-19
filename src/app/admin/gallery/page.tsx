import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/db';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ConfirmDelete } from '@/components/admin/confirm-delete';
import { ImageIcon, Plus, Pencil, Images } from 'lucide-react';
export const metadata: Metadata = { title: 'Gallery – Admin' };
export default async function AdminGalleryPage() {
  const albums = await prisma.galleryAlbum.findMany({ include: { _count: { select: { images: true } } }, orderBy: [{ order: 'asc' }, { createdAt: 'desc' }] });
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="font-serif text-2xl font-bold text-navy">Gallery</h1><p className="text-sm text-muted-foreground mt-1">Manage photo albums</p></div>
        <Link href="/admin/gallery/albums/new"><Button className="bg-navy hover:bg-navy-dark text-white gap-1.5"><Plus className="h-4 w-4"/>New Album</Button></Link>
      </div>
      {albums.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground"><ImageIcon className="h-12 w-12 mx-auto mb-3 opacity-30"/><p>No albums yet.</p></div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {albums.map(album => (
            <div key={album.id} className="rounded-xl border bg-background overflow-hidden hover:shadow-md transition-shadow group">
              <div className="relative h-40 bg-muted">
                <div className="w-full h-full flex items-center justify-center bg-navy/5">
                  <ImageIcon className="h-10 w-10 text-navy/20"/>
                </div>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Link href={`/admin/gallery/albums/${album.id}`}><Button size="sm" variant="secondary" className="gap-1"><Images className="h-3.5 w-3.5"/>Manage</Button></Link>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">{album.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">{album.category}</Badge>
                      <span className="text-xs text-muted-foreground">{album._count.images} photos</span>
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Link href={`/admin/gallery/albums/${album.id}`}><Button variant="ghost" size="sm" className="h-7 w-7 p-0"><Pencil className="h-3.5 w-3.5"/></Button></Link>
                    <ConfirmDelete id={album.id} entity="Album" apiPath="/api/gallery/albums"/>
                  </div>
                </div>
                <Badge variant="outline" className={`text-xs mt-2 ${album.isPublished?'border-green-300 text-green-700':'border-yellow-300 text-yellow-700'}`}>{album.isPublished?'Published':'Draft'}</Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
