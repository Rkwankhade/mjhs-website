import { Metadata } from 'next';
import { prisma } from '@/lib/db';
import { Badge } from '@/components/ui/badge';
export const metadata: Metadata = { title: 'Audit Logs – Admin' };
export default async function AuditLogsPage() {
  const logs = await prisma.auditLog.findMany({ include: { admin: { select: { name: true } } }, orderBy: { createdAt: 'desc' }, take: 200 });
  return (
    <div className="space-y-6">
      <div><h1 className="font-serif text-2xl font-bold text-navy">Audit Logs</h1><p className="text-sm text-muted-foreground mt-1">All admin actions are recorded here</p></div>
      <div className="rounded-xl border bg-background overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b bg-muted/40"><th className="text-left px-4 py-3 text-xs uppercase text-muted-foreground font-medium">Time</th><th className="text-left px-4 py-3 text-xs uppercase text-muted-foreground font-medium">Admin</th><th className="text-left px-4 py-3 text-xs uppercase text-muted-foreground font-medium">Action</th><th className="text-left px-4 py-3 text-xs uppercase text-muted-foreground font-medium">Entity</th><th className="text-left px-4 py-3 text-xs uppercase text-muted-foreground font-medium">Details</th></tr></thead>
          <tbody className="divide-y">
            {logs.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-10 text-muted-foreground">No audit logs yet.</td></tr>
            ) : logs.map(log => (
              <tr key={log.id} className="hover:bg-muted/20">
                <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{new Date(log.createdAt).toLocaleString('en-IN')}</td>
                <td className="px-4 py-3 text-xs font-medium">{log.admin?.name || 'System'}</td>
                <td className="px-4 py-3"><Badge variant="outline" className="text-xs">{log.action}</Badge></td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{log.entity}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground truncate max-w-xs">{log.details || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
