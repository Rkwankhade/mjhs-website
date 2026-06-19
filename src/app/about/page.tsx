import { Metadata } from 'next';
import Image from 'next/image';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PageHeader } from '@/components/shared/page-header';
import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { BookOpen, CheckCircle, GraduationCap, Heart, Target, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about M.J. High School, Karanja Lad — our history, mission, vision, and values since 1965.',
};

const TIMELINE = [
  { year: '1965', event: 'School founded by Mahatma Jyotiba Phule Trust with 120 students.' },
  { year: '1972', event: 'First SSC batch achieves 100% pass rate, establishing academic reputation.' },
  { year: '1985', event: 'Science laboratory and library wing inaugurated.' },
  { year: '1998', event: 'Digital learning center established with computer education.' },
  { year: '2010', event: 'School recognized as "Best Secondary School" in Washim District.' },
  { year: '2018', event: 'Smart classrooms and modern sports facilities added.' },
  { year: '2024', event: 'Digital transformation initiative launched for all classrooms.' },
];

const VALUES = [
  { icon: BookOpen, title: 'Academic Excellence', desc: 'Rigorous curriculum with focus on conceptual understanding and critical thinking.' },
  { icon: Heart, title: 'Holistic Development', desc: 'Nurturing physical, intellectual, emotional, and social growth equally.' },
  { icon: Users, title: 'Inclusive Community', desc: 'Welcoming students from all backgrounds and socioeconomic sections.' },
  { icon: Target, title: 'Character Building', desc: 'Instilling values of discipline, integrity, and respect for all.' },
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        <PageHeader title="About Us" breadcrumbs={[{ label: 'About' }]} />

        {/* Mission & Vision */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <ScrollReveal>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-gold">Our Purpose</span>
                  <h2 className="font-serif text-3xl font-bold text-navy mt-2 mb-4">Mission & Vision</h2>
                  <div className="space-y-6">
                    <div className="p-5 border-l-4 border-gold bg-gold/5 rounded-r-lg">
                      <h3 className="font-semibold text-navy mb-2">Our Mission</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        To provide quality, inclusive education that empowers every student with knowledge, skills, and values needed to contribute positively to society and the nation.
                      </p>
                    </div>
                    <div className="p-5 border-l-4 border-navy bg-navy/5 rounded-r-lg">
                      <h3 className="font-semibold text-navy mb-2">Our Vision</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        To be the leading educational institution in Washim District, producing well-rounded, ethical, and academically accomplished citizens who lead Maharashtra forward.
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={100}>
                <div className="grid grid-cols-2 gap-4">
                  {VALUES.map((v) => (
                    <div key={v.title} className="p-5 rounded-xl border hover:border-gold/50 hover:shadow-md transition-all bg-background">
                      <v.icon className="h-6 w-6 text-gold mb-3" />
                      <h4 className="font-semibold text-sm text-navy mb-1">{v.title}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">{v.desc}</p>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* History Timeline */}
        <section className="section-padding bg-muted/40">
          <div className="container-custom">
            <ScrollReveal>
              <div className="text-center mb-10">
                <span className="text-xs font-semibold uppercase tracking-widest text-gold">Our Journey</span>
                <h2 className="font-serif text-3xl font-bold text-navy mt-2">A Legacy of Excellence</h2>
              </div>
            </ScrollReveal>
            <div className="relative max-w-2xl mx-auto">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-navy/20" />
              <div className="space-y-8">
                {TIMELINE.map((item, i) => (
                  <ScrollReveal key={item.year} delay={i * 60}>
                    <div className="flex gap-6 pl-10 relative">
                      <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center text-xs font-bold shrink-0">
                        {i + 1}
                      </div>
                      <div className="flex-1 pb-2">
                        <span className="inline-block bg-gold text-navy text-xs font-bold px-2 py-0.5 rounded mb-2">{item.year}</span>
                        <p className="text-sm text-muted-foreground">{item.event}</p>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Real campus photos */}
        <section className="section-padding">
          <div className="container-custom">
            <ScrollReveal>
              <div className="text-center mb-10">
                <span className="text-xs font-semibold uppercase tracking-widest text-gold">Facilities</span>
                <h2 className="font-serif text-3xl font-bold text-navy mt-2">Our Campus</h2>
                <p className="text-muted-foreground text-sm mt-2 max-w-lg mx-auto">Two well-maintained buildings in the heart of Karanja Lad with colourful murals, open courtyards, and modern classrooms.</p>
              </div>
            </ScrollReveal>

            {/* Photo mosaic */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
              {[
                { src: '/images/campus/campus-1.jpeg', caption: 'Main Building & Murals', span: 'col-span-2 row-span-2' },
                { src: '/images/campus/campus-4.webp',  caption: 'School Entrance',        span: '' },
                { src: '/images/campus/campus-2.jpeg', caption: 'Administrative Block',    span: '' },
                { src: '/images/campus/campus-3.jpeg', caption: 'Campus Overview',         span: 'col-span-2' },
              ].map((photo, i) => (
                <ScrollReveal key={i} delay={i * 60}>
                  <div className={`relative rounded-xl overflow-hidden ${photo.span} aspect-[4/3]`}>
                    <Image src={photo.src} alt={photo.caption} fill sizes="(max-width:768px) 50vw, 25vw" className="object-cover hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <p className="absolute bottom-2 left-3 text-white text-xs font-medium drop-shadow">{photo.caption}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            {/* Facility highlights as text chips */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { icon: '🏫', name: 'Smart Classrooms', desc: '25 classrooms with projectors and interactive boards.' },
                { icon: '🔬', name: 'Science Labs', desc: 'Physics, Chemistry, and Biology labs fully equipped.' },
                { icon: '💻', name: 'Computer Lab', desc: '60-seat lab with high-speed internet.' },
                { icon: '📚', name: 'Library', desc: '5000+ books and digital resources.' },
                { icon: '⚽', name: 'Sports Ground', desc: 'Cricket ground, basketball court, and athletic track.' },
                { icon: '🎭', name: 'Auditorium', desc: '500-seat hall for events and programs.' },
              ].map((f, i) => (
                <ScrollReveal key={f.name} delay={i * 40}>
                  <div className="p-4 rounded-xl border hover:border-gold/50 hover:shadow-md transition-all bg-background flex items-start gap-3">
                    <span className="text-2xl shrink-0">{f.icon}</span>
                    <div><h3 className="font-semibold text-navy text-sm">{f.name}</h3><p className="text-xs text-muted-foreground mt-0.5">{f.desc}</p></div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Achievements Overview */}
        <section className="section-padding bg-navy text-white">
          <div className="container-custom">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              {[
                { n: '58+', label: 'Years of Service' },
                { n: '95%', label: 'SSC Pass Rate' },
                { n: '200+', label: 'State Toppers' },
                { n: '40+', label: 'Sports Trophies' },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-4xl font-bold font-serif text-gold mb-1">{s.n}</div>
                  <div className="text-sm text-navy-200">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Affiliations */}
        <section className="section-padding-sm">
          <div className="container-custom">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">Affiliated with</p>
              <div className="flex flex-wrap gap-4 justify-center items-center">
                {['Maharashtra State Board (SSC)', 'UDISE: 27xxxxxxxx', 'Samagra Shiksha Scheme', 'Swachh Bharat Abhiyan School'].map((a) => (
                  <div key={a} className="flex items-center gap-2 bg-muted px-4 py-2 rounded-full text-sm">
                    <CheckCircle className="h-4 w-4 text-gold" />
                    {a}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
