import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AnimatedCounter } from '@/components/shared/animated-counter';
import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { CampusGallery } from '@/components/home/campus-gallery';
import { prisma } from '@/lib/db';
import { ArrowRight, Award, BookOpen, Calendar, ChevronRight, GraduationCap, Star, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

async function getHomeData() {
  const [notices, events, achievements, faculty] = await Promise.all([
    prisma.notice.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: [{ isPinned: 'desc' }, { publishedAt: 'desc' }],
      take: 5,
    }),
    prisma.event.findMany({
      where: { status: { in: ['UPCOMING', 'ONGOING'] } },
      orderBy: { startDate: 'asc' },
      take: 3,
    }),
    prisma.achievement.findMany({
      where: { isFeatured: true },
      orderBy: [{ year: 'desc' }, { order: 'asc' }],
      take: 6,
    }),
    prisma.faculty.findMany({
      where: { isActive: true, isFeatured: true },
      orderBy: { order: 'asc' },
      take: 4,
    }),
  ]);
  return { notices, events, achievements, faculty };
}

export default async function HomePage() {
  const { notices, events, achievements, faculty } = await getHomeData();

  return (
    <>
      <Header />
      <main>
        {/* Hero Section — real campus photo background */}
        <section className="relative min-h-[90vh] flex items-center overflow-hidden">
          {/* Real school photo */}
          <Image
            src="/images/campus/campus-4.webp"
            alt="M.J. High School campus, Karanja Lad"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          {/* Dark overlay keeping text readable */}
          <div className="absolute inset-0 bg-navy/75" />
          {/* Subtle warm gradient on the left */}
          <div className="absolute inset-0 bg-gradient-to-r from-navy/60 via-navy/40 to-transparent" />

          <div className="container-custom relative z-10 py-20">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-gold/20 border border-gold/30 text-gold px-3 py-1.5 rounded-full text-xs font-medium mb-6 animate-fade-in">
                <Star className="h-3.5 w-3.5" />
                Excellence in Education Since 1965
              </div>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 animate-slide-up">
                Nurturing Minds,{' '}
                <span className="text-gold">Building Futures</span>
              </h1>
              <p className="text-lg text-navy-100 leading-relaxed mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                M.J. High School, Karanja Lad — a premier educational institution in Washim District, Maharashtra, dedicated to holistic development and academic excellence.
              </p>
              <div className="flex flex-wrap gap-3 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <Link href="/about" className="btn-gold">
                  Explore Our School <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
                <Link href="/contact" className="btn-outline-white">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent" />
        </section>

        {/* Stats */}
        <section className="section-padding-sm bg-gold">
          <div className="container-custom">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-navy">
              {[
                { value: 58, suffix: '+', label: 'Years of Excellence', icon: GraduationCap },
                { value: 1200, suffix: '+', label: 'Students Enrolled', icon: Users },
                { value: 45, suffix: '+', label: 'Dedicated Faculty', icon: BookOpen },
                { value: 95, suffix: '%', label: 'SSC Pass Rate', icon: Award },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <stat.icon className="h-7 w-7 mx-auto mb-2 text-navy/70" />
                  <div className="text-3xl lg:text-4xl font-bold font-serif">
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-sm font-medium text-navy/80 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Notices & Events */}
        <section className="section-padding bg-muted/40">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-10">
              {/* Notices */}
              <ScrollReveal>
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-serif text-2xl font-bold text-navy">Latest Notices</h2>
                    <Link href="/notices" className="text-sm text-gold font-medium hover:underline flex items-center gap-1">
                      View all <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                  <div className="space-y-3">
                    {notices.length === 0 ? (
                      <p className="text-muted-foreground text-sm">No notices available.</p>
                    ) : notices.map((n) => (
                      <Link key={n.id} href={`/notices/${n.id}`}
                        className="flex items-start gap-3 p-4 bg-background rounded-lg border hover:border-gold/50 hover:shadow-sm transition-all group">
                        {n.isPinned && <span className="mt-0.5 text-gold shrink-0">📌</span>}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm group-hover:text-gold transition-colors line-clamp-2">{n.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">{n.category}</Badge>
                            <span className="text-xs text-muted-foreground">
                              {n.publishedAt ? new Date(n.publishedAt).toLocaleDateString('en-IN') : ''}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-gold shrink-0 mt-0.5" />
                      </Link>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              {/* Events */}
              <ScrollReveal>
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-serif text-2xl font-bold text-navy">Upcoming Events</h2>
                    <Link href="/events" className="text-sm text-gold font-medium hover:underline flex items-center gap-1">
                      View all <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                  <div className="space-y-3">
                    {events.length === 0 ? (
                      <p className="text-muted-foreground text-sm">No upcoming events.</p>
                    ) : events.map((e) => (
                      <Link key={e.id} href={`/events/${e.id}`}
                        className="flex gap-4 p-4 bg-background rounded-lg border hover:border-gold/50 hover:shadow-sm transition-all group">
                        <div className="flex-shrink-0 w-14 h-14 bg-navy rounded-lg flex flex-col items-center justify-center text-white">
                          <span className="text-xs uppercase tracking-wide">{new Date(e.startDate).toLocaleString('en-IN', { month: 'short' })}</span>
                          <span className="text-xl font-bold">{new Date(e.startDate).getDate()}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm group-hover:text-gold transition-colors line-clamp-2">{e.title}</p>
                          {e.venue && <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">📍 {e.venue}</p>}
                          <Badge variant="outline" className="text-xs mt-1">{e.status}</Badge>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Achievements */}
        {achievements.length > 0 && (
          <section className="section-padding">
            <div className="container-custom">
              <ScrollReveal>
                <div className="text-center mb-10">
                  <h2 className="font-serif text-3xl font-bold text-navy mb-3">Our Achievements</h2>
                  <p className="text-muted-foreground max-w-xl mx-auto">Celebrating excellence and inspiring future generations through remarkable accomplishments.</p>
                </div>
              </ScrollReveal>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {achievements.map((a, i) => (
                  <ScrollReveal key={a.id} delay={i * 50}>
                    <div className="p-5 rounded-xl border hover:border-gold/40 hover:shadow-md transition-all bg-background group">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-2xl">🏆</span>
                        <Badge variant="outline">{a.category}</Badge>
                        <span className="ml-auto text-xs text-muted-foreground">{a.year}</span>
                      </div>
                      <h3 className="font-semibold text-sm group-hover:text-gold transition-colors">{a.title}</h3>
                      {a.studentName && <p className="text-xs text-muted-foreground mt-1">👤 {a.studentName}</p>}
                    </div>
                  </ScrollReveal>
                ))}
              </div>
              <div className="text-center mt-8">
                <Link href="/achievements" className="btn-navy">View All Achievements <ArrowRight className="h-4 w-4 ml-1" /></Link>
              </div>
            </div>
          </section>
        )}

        {/* Campus Gallery — real school photos */}
        <CampusGallery />

        {/* Principal Message */}
        <section className="section-padding bg-navy text-white">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center">
              <ScrollReveal>
                <div className="text-gold font-serif text-lg mb-4">"</div>
                <blockquote className="font-serif text-2xl md:text-3xl font-medium leading-relaxed mb-6">
                  Education is not the filling of a pail, but the lighting of a fire. At M.J. High School, we ignite that spark in every student.
                </blockquote>
                <div className="flex items-center justify-center gap-3">
                  <div className="h-px w-12 bg-gold/50" />
                  <div>
                    <p className="font-semibold text-gold">Principal</p>
                    <p className="text-sm text-navy-200">M.J. High School, Karanja Lad</p>
                  </div>
                  <div className="h-px w-12 bg-gold/50" />
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-padding">
          <div className="container-custom text-center">
            <ScrollReveal>
              <h2 className="font-serif text-3xl font-bold text-navy mb-4">Join Our School Community</h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Admissions open for the upcoming academic year. Give your child the best foundation for a bright future.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link href="/contact" className="btn-gold">Enquire About Admission <ArrowRight className="h-4 w-4 ml-1" /></Link>
                <Link href="/about" className="btn-outline-navy">Learn More About Us</Link>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
