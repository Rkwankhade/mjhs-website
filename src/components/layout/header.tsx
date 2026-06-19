'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GraduationCap, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { MobileNav } from '@/components/layout/mobile-nav';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/faculty', label: 'Faculty' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/achievements', label: 'Achievements' },
  { href: '/notices', label: 'Notices' },
  { href: '/events', label: 'Events' },
  { href: '/contact', label: 'Contact' },
];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full bg-navy text-white transition-shadow duration-300',
        scrolled && 'shadow-navy'
      )}
    >
      <div className="container-custom flex items-center justify-between h-16 md:h-20">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold text-navy-950">
            <GraduationCap className="h-5 w-5" />
          </span>
          <span className="leading-tight">
            <span className="block font-serif text-base md:text-lg font-bold">M.J. High School</span>
            <span className="block text-[11px] text-navy-100 tracking-wide">Karanja Lad · Est. 1965</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'px-3.5 py-2 rounded-md text-sm font-medium text-navy-50/90 hover:text-white hover:bg-white/10 transition-colors',
                pathname === link.href && 'text-gold-300'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Link
            href="/admin/login"
            className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-sm font-medium text-navy-50/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <ShieldCheck className="h-4 w-4" />
            Admin
          </Link>
          <ThemeToggle />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
