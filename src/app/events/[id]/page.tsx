import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PageHeader } from '@/components/shared/page-header';
import { prisma } from '@/lib/db';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Clock, MapPin, Users } from 'lucide-react';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const event = await prisma.event.findUnique({ where: { id: params.id } });
  if (!event) return { title: 'Event Not Found' };
  return { title: event.title, description: event.description || '' };
}

export default async function EventDetailPage({ params }: { params: { id: string } }) {
  const event = await prisma.event.findUnique({ where: { id: params.id } });
  if (!event) notFound();

  return (
    <>
      <Header />
      <main>
        <PageHeader title={event.title} breadcrumbs={[{ label: 'Events', href: '/events' }, { label: 'Detail' }]} />
        <section className="section-padding">
          <div className="container-custom max-w-3xl">
            <Link href="/events" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-navy mb-6">
              <ArrowLeft className="h-4 w-4" /> Back to Events
            </Link>
            <div className="rounded-xl border p-6 md:p-8 bg-background">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline">{event.category}</Badge>
                <Badge variant="outline" className={event.status === 'UPCOMING' ? 'border-blue-300 text-blue-700' : event.status === 'ONGOING' ? 'border-green-300 text-green-700' : ''}>{event.status}</Badge>
              </div>
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-navy mb-6">{event.title}</h1>
              <div className="grid sm:grid-cols-2 gap-4 mb-6 pb-6 border-b">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 text-gold shrink-0" />
                  <span>{new Date(event.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
                {event.endDate && event.endDate.getTime() !== event.startDate.getTime() && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 text-gold shrink-0" />
                    <span>Ends: {new Date(event.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                )}
                {event.venue && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 text-gold shrink-0" />
                    <span>{event.venue}</span>
                  </div>
                )}
              </div>
              {event.description && (
                <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap">{event.description}</div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
