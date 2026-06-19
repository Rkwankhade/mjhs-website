import { Metadata } from 'next';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { StatsCard } from '@/components/admin/stats-card';
import { Bell, Calendar, Trophy, ImageIcon, Users, MessageSquare, ArrowRight, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = { title: 'Dashboard – Admin' };

async function getDashboardStats() {
  const [notices, events, achievements, faculty, messages, galleries, recentMessages, recentNotices, pendingUsers] = await Promise.all([
    prisma.notice.count({ where: { status: 'PUBLISHED' } }),
    prisma.event.count({ where: { status: { in: ['UPCOMING', 'ONGOING'] } } }),
    prisma.achievement.count(),
    prisma.faculty.count({ where: { isActive: true } }),
    prisma.contactMessage.count({ where: { status: 'UNREAD' } }),
    prisma.galleryAlbum.count({ where: { isPublished: true } }),
    prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
    prisma.notice.findMany({ where: { status: 'PUBLISHED' }, orderBy: { publishedAt: 'desc' }, take: 5 }),
    prisma.admin.count({ where: { status: 'PENDING' } }),
  ]);
  return { notices, events, achievements, faculty, messages, galleries, recentMessages, recentNotices, pendingUsers };
}

export default async function DashboardPage() {
  const session = await auth();
  const isSuperAdmin = (session?.user as any)?.role === 'SUPER_ADMIN';
  const stats = await getDashboardStats();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl font-bold text-navy">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Welcome back. Here's what's happening at the school.</p>
      </div>

      {/* Pending users alert — super admin only */}
      {isSuperAdmin && stats.pendingUsers > 0 && (
        <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
          <span className="text-2xl">🔔</span>
          <div className="flex-1">
            <p className="font-semibold text-yellow-800 text-sm">
              {stats.pendingUsers} user{stats.pendingUsers > 1 ? 's' : ''} waiting for approval
            </p>
            <p className="text-xs text-yellow-700 mt-0.5">New staff account requests need your review.</p>
          </div>
          <Link href="/admin/users" className="shrink-0 px-4 py-1.5 bg-yellow-600 hover:bg-yellow-700 text-white text-xs font-medium rounded-lg transition-colors">
            Review Now
          </Link>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatsCard title="Published Notices" value={stats.notices} icon={Bell} color="navy" />
        <StatsCard title="Active Events" value={stats.events} icon={Calendar} color="blue" />
        <StatsCard title="Achievements" value={stats.achievements} icon={Trophy} color="gold" />
        <StatsCard title="Active Faculty" value={stats.faculty} icon={Users} color="green" />
        <StatsCard title="Unread Messages" value={stats.messages} icon={MessageSquare} description="Requires attention" color={stats.messages > 0 ? 'gold' : 'navy'} />
        <StatsCard title="Albums" value={stats.galleries} icon={ImageIcon} color="blue" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Messages */}
        <div className="rounded-xl border bg-background">
          <div className="flex items-center justify-between p-5 border-b">
            <h2 className="font-semibold">Recent Messages</h2>
            <Link href="/admin/messages" className="text-xs text-gold hover:underline flex items-center gap-1">View all <ArrowRight className="h-3 w-3" /></Link>
          </div>
          <div className="divide-y">
            {stats.recentMessages.length === 0 ? (
              <p className="p-5 text-sm text-muted-foreground text-center">No messages yet.</p>
            ) : stats.recentMessages.map(msg => (
              <div key={msg.id} className="p-4 flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-navy/10 flex items-center justify-center text-sm font-bold text-navy shrink-0">{msg.name[0]}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate">{msg.name}</p>
                    {msg.status === 'UNREAD' && <Badge className="bg-red-100 text-red-700 text-xs">New</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{msg.subject}</p>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">{new Date(msg.createdAt).toLocaleDateString('en-IN')}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Notices */}
        <div className="rounded-xl border bg-background">
          <div className="flex items-center justify-between p-5 border-b">
            <h2 className="font-semibold">Recent Notices</h2>
            <Link href="/admin/notices" className="text-xs text-gold hover:underline flex items-center gap-1">View all <ArrowRight className="h-3 w-3" /></Link>
          </div>
          <div className="divide-y">
            {stats.recentNotices.length === 0 ? (
              <p className="p-5 text-sm text-muted-foreground text-center">No notices yet.</p>
            ) : stats.recentNotices.map(n => (
              <div key={n.id} className="p-4 flex items-start gap-3">
                <Bell className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{n.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge variant="outline" className="text-xs">{n.category}</Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-0.5"><Eye className="h-3 w-3" />{n.viewCount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: 'New Notice', href: '/admin/notices/new', icon: Bell },
            { label: 'New Event', href: '/admin/events/new', icon: Calendar },
            { label: 'New Achievement', href: '/admin/achievements/new', icon: Trophy },
            { label: 'New Album', href: '/admin/gallery/albums/new', icon: ImageIcon },
            { label: 'Add Faculty', href: '/admin/faculty/new', icon: Users },
            { label: 'View Messages', href: '/admin/messages', icon: MessageSquare },
          ].map(action => (
            <Link key={action.href} href={action.href}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border bg-background hover:border-gold/50 hover:shadow-sm transition-all text-center group">
              <action.icon className="h-6 w-6 text-muted-foreground group-hover:text-gold transition-colors" />
              <span className="text-xs font-medium text-muted-foreground group-hover:text-navy transition-colors">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
