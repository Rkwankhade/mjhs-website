import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PageHeader } from '@/components/shared/page-header';
import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { EmptyState } from '@/components/shared/empty-state';
import { prisma } from '@/lib/db';
import { ImageIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = { title: 'Gallery', description: 'Photo galleries from events, activities, and daily life at M.J. High School.' };

export default async function GalleryPage() {
  const albums = await prisma.galleryAlbum.findMany({
    where: { isPublished: true },
    include: { images: { take: 1, where: { isCover: true }, orderBy: { order: 'asc' } } },
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  });

  return (
    <>
      <Header />
      <main>
        <PageHeader title="Photo Gallery" subtitle="Capturing memories and milestones" breadcrumbs={[{ label: 'Gallery' }]} />
        <section className="section-padding">
          <div className="container-custom">
            {albums.length === 0 ? (
              <EmptyState icon={<ImageIcon className="h-10 w-10" />} title="No Albums" description="Gallery albums will appear here soon." />
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {albums.map((album, i) => {
                  const cover = album.images[0];
                  return (
                    <ScrollReveal key={album.id} delay={i * 40}>
                      <Link href={`/gallery/${album.id}`} className="group block rounded-xl border overflow-hidden hover:border-gold/50 hover:shadow-lg transition-all bg-background">
                        <div className="relative h-44 bg-navy/10 overflow-hidden">
                          {cover ? (
                            <Image src={cover.url} alt={cover.alt || album.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-navy/20 to-navy/5">
                              <ImageIcon className="h-10 w-10 text-navy/30" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-navy group-hover:text-gold transition-colors line-clamp-1">{album.title}</h3>
                          {album.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{album.description}</p>}
                          <div className="flex items-center justify-between mt-2">
                            <Badge variant="outline" className="text-xs">{album.category}</Badge>
                            {album.eventDate && <span className="text-xs text-muted-foreground">{new Date(album.eventDate).toLocaleDateString('en-IN')}</span>}
                          </div>
                        </div>
                      </Link>
                    </ScrollReveal>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
