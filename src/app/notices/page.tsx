import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PageHeader } from '@/components/shared/page-header';
import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { EmptyState } from '@/components/shared/empty-state';
import { prisma } from '@/lib/db';
import { Badge } from '@/components/ui/badge';
import { Bell, Download, Pin } from 'lucide-react';

export const metadata: Metadata = { title: 'Notices', description: 'Latest notices and announcements from M.J. High School.' };

export default async function NoticesPage({ searchParams }: { searchParams: { category?: string } }) {
  const category = searchParams.category;
  const notices = await prisma.notice.findMany({
    where: { status: 'PUBLISHED', ...(category && category !== 'ALL' ? { category: category as any } : {}) },
    orderBy: [{ isPinned: 'desc' }, { publishedAt: 'desc' }],
  });

  const CATEGORIES = ['ALL', 'GENERAL', 'ACADEMIC', 'EXAM', 'SPORTS', 'CULTURAL', 'HOLIDAY', 'ADMISSION', 'RESULT'];

  return (
    <>
      <Header />
      <main>
        <PageHeader title="Notices & Announcements" breadcrumbs={[{ label: 'Notices' }]} />
        <section className="section-padding">
          <div className="container-custom max-w-4xl">
            {/* Category filter */}
            <div className="flex flex-wrap gap-2 mb-8">
              {CATEGORIES.map(cat => (
                <Link key={cat} href={cat === 'ALL' ? '/notices' : `/notices?category=${cat}`}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${(!category && cat === 'ALL') || category === cat ? 'bg-navy text-white border-navy' : 'border-border hover:border-navy text-muted-foreground hover:text-navy'}`}>
                  {cat}
                </Link>
              ))}
            </div>

            {notices.length === 0 ? (
              <EmptyState icon={<Bell className="h-10 w-10" />} title="No Notices" description="No notices available in this category." />
            ) : (
              <div className="space-y-3">
                {notices.map((n, i) => (
                  <ScrollReveal key={n.id} delay={i * 30}>
                    <Link href={`/notices/${n.id}`} className="flex items-start gap-4 p-5 border rounded-xl hover:border-gold/50 hover:shadow-md transition-all bg-background group">
                      {n.isPinned && <Pin className="h-4 w-4 text-gold shrink-0 mt-0.5" />}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium group-hover:text-gold transition-colors">{n.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{n.content.slice(0, 150)}...</p>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">{n.category}</Badge>
                          {n.publishedAt && <span className="text-xs text-muted-foreground">{new Date(n.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>}
                          {n.pdfUrl && <span className="flex items-center gap-1 text-xs text-blue-600"><Download className="h-3 w-3" /> PDF</span>}
                        </div>
                      </div>
                    </Link>
                  </ScrollReveal>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
