import { ScrollReveal } from '@/components/shared/scroll-reveal';

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
}

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <section className="relative bg-gradient-navy text-white overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-hero-pattern bg-cover bg-center" aria-hidden />
      <div className="container-custom relative py-16 md:py-24 text-center">
        <ScrollReveal>
          <span className="section-label text-gold-300">{eyebrow}</span>
          <h1 className="heading-display mt-3 text-white">{title}</h1>
          {description && (
            <p className="mt-4 max-w-2xl mx-auto text-navy-100 text-base md:text-lg">{description}</p>
          )}
          <div className="gold-divider mx-auto mt-6" />
        </ScrollReveal>
      </div>
    </section>
  );
}
