import { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PageHeader } from '@/components/shared/page-header';
import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { EmptyState } from '@/components/shared/empty-state';
import { prisma } from '@/lib/db';
import { Badge } from '@/components/ui/badge';
import { Award } from 'lucide-react';

export const metadata: Metadata = { title: 'Achievements', description: 'Celebrating academic and extracurricular achievements at M.J. High School.' };

export const dynamic = 'force-dynamic';

const CATEGORY_ICONS: Record<string, string> = {
  ACADEMIC: '📚', SPORTS: '🏆', CULTURAL: '🎭', SCIENCE: '🔬', ARTS: '🎨', OTHER: '⭐',
};

export default async function AchievementsPage() {
  const achievements = await prisma.achievement.findMany({ orderBy: [{ year: 'desc' }, { order: 'asc' }] });
  const years = [...new Set(achievements.map(a => a.year))].sort((a, b) => b - a);

  return (
    <>
      <Header />
      <main>
        <PageHeader title="Achievements" subtitle="Proud moments that define our legacy" breadcrumbs={[{ label: 'Achievements' }]} />
        <section className="section-padding">
          <div className="container-custom">
            {achievements.length === 0 ? (
              <EmptyState icon={<Award className="h-10 w-10" />} title="No Achievements" description="Achievements will be listed here soon." />
            ) : (
              <div className="space-y-12">
                {years.map(year => (
                  <div key={year}>
                    <div className="flex items-center gap-4 mb-6">
                      <h2 className="font-serif text-2xl font-bold text-navy">{year}</h2>
                      <div className="flex-1 h-px bg-border" />
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {achievements.filter(a => a.year === year).map((a, i) => (
                        <ScrollReveal key={a.id} delay={i * 40}>
                          <div className="p-5 rounded-xl border hover:border-gold/50 hover:shadow-md transition-all bg-background group">
                            <div className="flex items-start gap-3">
                              <span className="text-3xl shrink-0">{CATEGORY_ICONS[a.category] || '⭐'}</span>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="outline" className="text-xs">{a.category}</Badge>
                                  {a.isFeatured && <Badge className="bg-gold/20 text-gold-dark border border-gold/30 text-xs">Featured</Badge>}
                                </div>
                                <h3 className="font-semibold text-navy group-hover:text-gold transition-colors text-sm">{a.title}</h3>
                                {a.studentName && <p className="text-xs text-muted-foreground mt-1">👤 {a.studentName}</p>}
                                {a.teacherName && <p className="text-xs text-muted-foreground">👨‍🏫 {a.teacherName}</p>}
                                {a.description && <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{a.description}</p>}
                                {a.level && <Badge variant="outline" className="text-xs mt-2 capitalize">{a.level.toLowerCase()}</Badge>}
                              </div>
                            </div>
                          </div>
                        </ScrollReveal>
                      ))}
                    </div>
                  </div>
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



