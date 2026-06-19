import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PageHeader } from '@/components/shared/page-header';
import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { EmptyState } from '@/components/shared/empty-state';
import { prisma } from '@/lib/db';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin } from 'lucide-react';

export const metadata: Metadata = { title: 'Events', description: 'Upcoming and past events at M.J. High School, Karanja Lad.' };

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    orderBy: { startDate: 'desc' },
  });

  const upcoming = events.filter(e => ['UPCOMING', 'ONGOING'].includes(e.status));
  const past = events.filter(e => e.status === 'COMPLETED');

  return (
    <>
      <Header />
      <main>
        <PageHeader title="Events" subtitle="Stay updated with school activities and programs" breadcrumbs={[{ label: 'Events' }]} />
        <section className="section-padding">
          <div className="container-custom max-w-5xl">
            {upcoming.length > 0 && (
              <div className="mb-12">
                <h2 className="font-serif text-2xl font-bold text-navy mb-6">Upcoming Events</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {upcoming.map((e, i) => (
                    <ScrollReveal key={e.id} delay={i * 40}>
                      <Link href={`/events/${e.id}`} className="block rounded-xl border hover:border-gold/50 hover:shadow-lg transition-all overflow-hidden bg-background group">
                        <div className="h-2 bg-gold" />
                        <div className="p-5">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 bg-navy rounded-lg flex flex-col items-center justify-center text-white shrink-0">
                              <span className="text-[10px] uppercase tracking-wide">{new Date(e.startDate).toLocaleString('en-IN', { month: 'short' })}</span>
                              <span className="text-lg font-bold leading-none">{new Date(e.startDate).getDate()}</span>
                            </div>
                            <div>
                              <Badge variant="outline" className={e.status === 'ONGOING' ? 'border-green-400 text-green-700' : 'border-blue-300 text-blue-700'}>{e.status}</Badge>
                            </div>
                          </div>
                          <h3 className="font-semibold text-navy group-hover:text-gold transition-colors mb-1">{e.title}</h3>
                          {e.venue && <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />{e.venue}</p>}
                          {e.description && <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{e.description}</p>}
                        </div>
                      </Link>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            )}
            {past.length > 0 && (
              <div>
                <h2 className="font-serif text-2xl font-bold text-navy mb-6">Past Events</h2>
                <div className="space-y-3">
                  {past.map((e, i) => (
                    <ScrollReveal key={e.id} delay={i * 30}>
                      <Link href={`/events/${e.id}`} className="flex items-start gap-4 p-4 border rounded-lg hover:border-gold/40 hover:shadow-sm transition-all bg-background group">
                        <div className="w-12 h-12 bg-muted rounded-lg flex flex-col items-center justify-center text-muted-foreground shrink-0">
                          <span className="text-[10px] uppercase">{new Date(e.startDate).toLocaleString('en-IN', { month: 'short' })}</span>
                          <span className="text-base font-bold leading-none">{new Date(e.startDate).getDate()}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium group-hover:text-gold transition-colors">{e.title}</h3>
                          {e.venue && <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><MapPin className="h-3 w-3" />{e.venue}</p>}
                        </div>
                        <Badge variant="outline" className="text-xs shrink-0">{e.category}</Badge>
                      </Link>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            )}
            {events.length === 0 && (
              <EmptyState icon={<Calendar className="h-10 w-10" />} title="No Events" description="No events have been posted yet." />
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
