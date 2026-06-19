import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PageHeader } from '@/components/shared/page-header';
import { prisma } from '@/lib/db';
import { ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Lightbox } from '@/components/shared/lightbox';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const album = await prisma.galleryAlbum.findUnique({ where: { id: params.id } });
  if (!album) return { title: 'Album Not Found' };
  return { title: album.title, description: album.description || '' };
}

export default async function GalleryAlbumPage({ params }: { params: { id: string } }) {
  const album = await prisma.galleryAlbum.findUnique({ where: { id: params.id }, include: { images: { orderBy: { order: 'asc' } } } });
  if (!album || !album.isPublished) notFound();

  return (
    <>
      <Header />
      <main>
        <PageHeader title={album.title} breadcrumbs={[{ label: 'Gallery', href: '/gallery' }, { label: album.title }]} />
        <section className="section-padding">
          <div className="container-custom">
            <Link href="/gallery" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-navy mb-6">
              <ArrowLeft className="h-4 w-4" /> Back to Gallery
            </Link>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="outline">{album.category}</Badge>
              {album.eventDate && <span className="text-sm text-muted-foreground">{new Date(album.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>}
              <span className="text-sm text-muted-foreground">{album.images.length} photos</span>
            </div>
            {album.description && <p className="text-muted-foreground mb-6">{album.description}</p>}
            <Lightbox images={album.images.map(img => ({ src: img.url, alt: img.alt || img.caption || album.title, caption: img.caption || '' }))} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
