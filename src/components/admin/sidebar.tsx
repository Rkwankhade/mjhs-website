'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  GraduationCap, LayoutDashboard, Bell, Calendar,
  Trophy, ImageIcon, Users, MessageSquare, Settings,
  BookOpen, FileText, ShieldCheck, UserPlus,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const NAV_ALL = [
  { label: 'Dashboard',    href: '/admin/dashboard',    icon: LayoutDashboard,  superOnly: false },
  { label: 'Notices',      href: '/admin/notices',      icon: Bell,             superOnly: false },
  { label: 'Events',       href: '/admin/events',       icon: Calendar,         superOnly: false },
  { label: 'Achievements', href: '/admin/achievements', icon: Trophy,           superOnly: false },
  { label: 'Gallery',      href: '/admin/gallery',      icon: ImageIcon,        superOnly: false },
  { label: 'Faculty',      href: '/admin/faculty',      icon: Users,            superOnly: false },
  { label: 'Messages',     href: '/admin/messages',     icon: MessageSquare,    superOnly: false },
  { label: 'Audit Logs',   href: '/admin/audit-logs',   icon: FileText,         superOnly: false },
];

const NAV_SUPER = [
  { label: 'User Management', href: '/admin/users',    icon: ShieldCheck },
  { label: 'Settings',        href: '/admin/settings', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isSuperAdmin = (session?.user as any)?.role === 'SUPER_ADMIN';

  const isActive = (href: string) =>
    pathname === href || (href !== '/admin/dashboard' && pathname.startsWith(href));

  return (
    <aside className="w-64 bg-navy text-white flex flex-col overflow-y-auto shrink-0">
      {/* Logo */}
      <div className="p-5 border-b border-white/10">
        <Link href="/admin/dashboard" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold text-navy shrink-0">
            <GraduationCap className="h-5 w-5" />
          </span>
          <div className="leading-tight min-w-0">
            <div className="text-sm font-bold truncate">M.J. High School</div>
            <div className="text-[10px] text-navy-200 flex items-center gap-1">
              {isSuperAdmin
                ? <><ShieldCheck className="h-3 w-3 text-gold" />Super Admin</>
                : 'Staff Panel'}
            </div>
          </div>
        </Link>
      </div>

      {/* Main nav */}
      <nav className="flex-1 p-4 space-y-0.5">
        <p className="text-[10px] uppercase tracking-widest text-navy-300 font-medium px-3 pt-1 pb-2">Content</p>
        {NAV_ALL.map((item) => (
          <Link key={item.href} href={item.href}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
              isActive(item.href)
                ? 'bg-white/20 text-white'
                : 'text-navy-200 hover:bg-white/10 hover:text-white'
            )}>
            <item.icon className="h-4 w-4 shrink-0" />
            {item.label}
          </Link>
        ))}

        {/* Super Admin only section */}
        {isSuperAdmin && (
          <>
            <p className="text-[10px] uppercase tracking-widest text-navy-300 font-medium px-3 pt-4 pb-2">
              Administration
            </p>
            {NAV_SUPER.map((item) => (
              <Link key={item.href} href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive(item.href)
                    ? 'bg-gold/30 text-gold'
                    : 'text-navy-200 hover:bg-white/10 hover:text-white'
                )}>
                <item.icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            ))}
          </>
        )}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 space-y-2">
        <div className="flex items-center gap-2 px-1">
          <div className="h-7 w-7 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">
            {(session?.user?.name || 'A')[0].toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium truncate">{session?.user?.name}</p>
            <p className="text-[10px] text-navy-300 truncate">{session?.user?.email}</p>
          </div>
        </div>
        <Link href="/" className="flex items-center gap-2 text-xs text-navy-200 hover:text-white transition-colors px-1">
          <BookOpen className="h-3.5 w-3.5" /> View Public Site
        </Link>
      </div>
    </aside>
  );
}
