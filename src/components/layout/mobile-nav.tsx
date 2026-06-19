'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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

export function MobileNav() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="text-current hover:bg-white/10"
      >
        <Menu className="h-6 w-6" />
      </Button>

      {open && (
        <div className="fixed inset-0 z-[60] bg-navy-950/98 animate-fade-in">
          <div className="flex items-center justify-between px-4 h-16 border-b border-white/10">
            <span className="font-serif text-lg font-bold text-white">Menu</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="text-white hover:bg-white/10"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          <nav className="flex flex-col px-4 py-6 gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-4 py-3.5 rounded-lg text-base font-medium text-white/90 hover:bg-white/10 hover:text-white transition-colors',
                  pathname === link.href && 'bg-gold text-navy-950 hover:bg-gold hover:text-navy-950'
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/admin/login"
              className="mt-4 px-4 py-3.5 rounded-lg text-base font-medium text-gold-300 border border-gold-300/30 text-center hover:bg-gold-300/10 transition-colors"
            >
              Admin Login
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}
