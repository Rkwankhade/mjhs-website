import { Metadata } from 'next';
import Image from 'next/image';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PageHeader } from '@/components/shared/page-header';
import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { prisma } from '@/lib/db';
import { Mail, Phone } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = { title: 'Our Faculty', description: 'Meet the dedicated teaching staff of M.J. High School, Karanja Lad.' };

const DEPARTMENTS = ['All', 'Science', 'Mathematics', 'Social Science', 'Languages', 'Commerce', 'Physical Education', 'Arts'];

export default async function FacultyPage() {
  const faculty = await prisma.faculty.findMany({ where: { isActive: true }, orderBy: [{ order: 'asc' }, { name: 'asc' }] });
  const departments = [...new Set(faculty.map(f => f.department))];

  return (
    <>
      <Header />
      <main>
        <PageHeader title="Our Faculty" subtitle="Meet our dedicated and experienced educators" breadcrumbs={[{ label: 'Faculty' }]} />
        <section className="section-padding">
          <div className="container-custom">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {faculty.map((member, i) => (
                <ScrollReveal key={member.id} delay={i * 40}>
                  <div className="rounded-xl border hover:border-gold/50 hover:shadow-lg transition-all overflow-hidden bg-background group">
                    <div className="relative h-48 bg-navy/10">
                      {member.image ? (
                        <Image src={member.image} alt={member.name} fill className="object-cover object-top" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-navy to-navy-dark">
                          <span className="text-5xl font-serif font-bold text-gold/60">{member.name[0]}</span>
                        </div>
                      )}
                      {member.isFeatured && (
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-gold text-navy text-xs">⭐ Featured</Badge>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-navy group-hover:text-gold transition-colors">{member.name}</h3>
                      <p className="text-sm text-muted-foreground">{member.designation}</p>
                      <div className="flex gap-2 flex-wrap mt-2">
                        <Badge variant="outline" className="text-xs">{member.department}</Badge>
                        <Badge variant="outline" className="text-xs">{member.experience} yrs exp</Badge>
                      </div>
                      {member.bio && <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{member.bio}</p>}
                      <div className="mt-3 space-y-1">
                        {member.email && (
                          <a href={`mailto:${member.email}`} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-gold transition-colors">
                            <Mail className="h-3 w-3" /> {member.email}
                          </a>
                        )}
                        {member.phone && (
                          <a href={`tel:${member.phone}`} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-gold transition-colors">
                            <Phone className="h-3 w-3" /> {member.phone}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
