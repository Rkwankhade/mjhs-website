import Link from 'next/link';
import { GraduationCap, MapPin, Phone, Mail, Facebook, Youtube } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-navy-dark text-white">
      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold text-navy-950">
                <GraduationCap className="h-5 w-5" />
              </span>
              <span className="leading-tight">
                <span className="block font-serif text-base font-bold">M.J. High School</span>
                <span className="block text-[11px] text-navy-200 tracking-wide">Karanja Lad · Est. 1965</span>
              </span>
            </Link>
            <p className="text-sm text-navy-200 leading-relaxed mb-4">
              Nurturing Minds, Building Futures. Providing quality education to the students of Washim District since 1965.
            </p>
            <div className="flex gap-3">
              <a href="#" className="h-8 w-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-gold hover:text-navy transition-colors" aria-label="Facebook">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="h-8 w-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-gold hover:text-navy transition-colors" aria-label="YouTube">
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { href: '/about', label: 'About Us' },
                { href: '/faculty', label: 'Our Faculty' },
                { href: '/achievements', label: 'Achievements' },
                { href: '/gallery', label: 'Gallery' },
                { href: '/notices', label: 'Notices' },
                { href: '/events', label: 'Events' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-navy-200 hover:text-gold transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Academics */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Academics</h3>
            <ul className="space-y-2">
              {['Class 8', 'Class 9', 'Class 10 (SSC)', 'Science Stream', 'Arts Stream', 'Scholarship Guidance'].map((item) => (
                <li key={item}>
                  <span className="text-sm text-navy-200">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Contact</h3>
            <ul className="space-y-3">
              <li className="flex gap-2 text-sm text-navy-200">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-gold" />
                <span>M.J. High School, Main Road, Karanja Lad, Washim – 444105, Maharashtra</span>
              </li>
              <li className="flex gap-2 text-sm text-navy-200">
                <Phone className="h-4 w-4 shrink-0 mt-0.5 text-gold" />
                <a href="tel:+917xxxxxxxxx" className="hover:text-gold transition-colors">+91 7xxx-xxxxxx</a>
              </li>
              <li className="flex gap-2 text-sm text-navy-200">
                <Mail className="h-4 w-4 shrink-0 mt-0.5 text-gold" />
                <a href="mailto:info@mjhskaranja.edu.in" className="hover:text-gold transition-colors">info@mjhskaranja.edu.in</a>
              </li>
            </ul>
            <Link href="/contact" className="mt-4 inline-block text-sm text-gold hover:underline">
              Send us a message →
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-custom py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-navy-300">
          <p>© {new Date().getFullYear()} M.J. High School, Karanja Lad. All rights reserved.</p>
          <p>Designed with ❤ for quality education</p>
        </div>
      </div>
    </footer>
  );
}
