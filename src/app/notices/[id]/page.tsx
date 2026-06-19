import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PageHeader } from '@/components/shared/page-header';
import { prisma } from '@/lib/db';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Download, Eye, Pin } from 'lucide-react';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const notice = await prisma.notice.findUnique({ where: { id: params.id } });
  if (!notice) return { title: 'Notice Not Found' };
  return { title: notice.title, description: notice.content.slice(0, 160) };
}

export default async function NoticeDetailPage({ params }: { params: { id: string } }) {
  const notice = await prisma.notice.findUnique({ where: { id: params.id } });
  if (!notice || notice.status !== 'PUBLISHED') notFound();

  await prisma.notice.update({ where: { id: params.id }, data: { viewCount: { increment: 1 } } });

  return (
    <>
      <Header />
      <main>
        <PageHeader title={notice.title} breadcrumbs={[{ label: 'Notices', href: '/notices' }, { label: 'Detail' }]} />
        <section className="section-padding">
          <div className="container-custom max-w-3xl">
            <Link href="/notices" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-navy mb-6 transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back to Notices
            </Link>
            <div className="rounded-xl border p-6 md:p-8 bg-background">
              <div className="flex flex-wrap gap-2 mb-4">
                {notice.isPinned && <Badge className="bg-gold text-navy"><Pin className="h-3 w-3 mr-1" />Pinned</Badge>}
                <Badge variant="outline">{notice.category}</Badge>
                <Badge variant="outline" className={notice.status === 'PUBLISHED' ? 'border-green-200 text-green-700' : ''}>{notice.status}</Badge>
              </div>
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-navy mb-4">{notice.title}</h1>
              <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mb-6 pb-6 border-b">
                {notice.publishedAt && <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Published: {new Date(notice.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>}
                <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {notice.viewCount} views</span>
                {notice.expiresAt && <span className="text-orange-600">Expires: {new Date(notice.expiresAt).toLocaleDateString('en-IN')}</span>}
              </div>
              <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap">{notice.content}</div>
              {notice.pdfUrl && (
                <div className="mt-6 pt-6 border-t">
                  <a href={notice.pdfUrl} target="_blank" rel="noopener noreferrer" className="btn-navy">
                    <Download className="h-4 w-4" /> Download PDF
                  </a>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
