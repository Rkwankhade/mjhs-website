'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import {
  CheckCircle, XCircle, Trash2, ShieldCheck, UserCog,
  KeyRound, Loader2, Search, UserPlus, Clock, Ban,
} from 'lucide-react';

interface User {
  id: string; name: string; email: string; phone?: string | null;
  role: string; status: string; createdAt: string;
}

interface Props { users: User[]; currentUserId: string; }

const STATUS_CONFIG: Record<string, { label: string; icon: any; cls: string }> = {
  ACTIVE:  { label: 'Active',  icon: CheckCircle, cls: 'bg-green-100 text-green-700 border-green-200' },
  PENDING: { label: 'Pending', icon: Clock,        cls: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  BLOCKED: { label: 'Blocked', icon: Ban,          cls: 'bg-red-100 text-red-600 border-red-200' },
};

const ROLE_CONFIG: Record<string, { label: string; cls: string }> = {
  SUPER_ADMIN: { label: 'Super Admin', cls: 'bg-navy text-white border-navy' },
  STAFF:       { label: 'Staff',       cls: 'bg-blue-100 text-blue-700 border-blue-200' },
};

export function UsersTable({ users: initialUsers, currentUserId }: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [resetTarget, setResetTarget] = useState<User | null>(null);

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'ALL' || u.status === filter;
    return matchSearch && matchFilter;
  });

  async function patch(id: string, data: any, successMsg: string) {
    setLoading(id + JSON.stringify(data));
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      const updated = await res.json();
      setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updated } : u));
      toast({ title: successMsg });
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    } finally { setLoading(null); }
  }

  async function deleteUser(id: string) {
    setLoading(id + 'delete');
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      setUsers(prev => prev.filter(u => u.id !== id));
      toast({ title: 'User deleted' });
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    } finally { setLoading(null); }
  }

  async function resetPassword() {
    if (!resetTarget || newPassword.length < 8) {
      toast({ title: 'Password must be at least 8 characters', variant: 'destructive' }); return;
    }
    await patch(resetTarget.id, { password: newPassword }, `Password reset for ${resetTarget.name}`);
    setResetTarget(null);
    setNewPassword('');
  }

  const isLoading = (id: string, action: string) => loading === id + action;

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by name or email..." value={search}
            onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="flex gap-2">
          {['ALL', 'PENDING', 'ACTIVE', 'BLOCKED'].map(s => (
            <Button key={s} size="sm" variant={filter === s ? 'default' : 'outline'}
              onClick={() => setFilter(s)}
              className={filter === s ? 'bg-navy text-white' : ''}>
              {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
              {s !== 'ALL' && (
                <span className="ml-1.5 bg-white/20 rounded-full px-1.5 py-0.5 text-[10px]">
                  {users.filter(u => u.status === s).length}
                </span>
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-background overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="text-left px-4 py-3 text-xs uppercase text-muted-foreground font-medium">User</th>
                <th className="text-left px-4 py-3 text-xs uppercase text-muted-foreground font-medium">Role</th>
                <th className="text-left px-4 py-3 text-xs uppercase text-muted-foreground font-medium">Status</th>
                <th className="text-left px-4 py-3 text-xs uppercase text-muted-foreground font-medium">Joined</th>
                <th className="text-right px-4 py-3 text-xs uppercase text-muted-foreground font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-12 text-muted-foreground">No users found.</td></tr>
              ) : filtered.map(user => {
                const statusCfg = STATUS_CONFIG[user.status] || STATUS_CONFIG.PENDING;
                const roleCfg   = ROLE_CONFIG[user.role]     || ROLE_CONFIG.STAFF;
                const isMe = user.id === currentUserId;

                return (
                  <tr key={user.id} className={`hover:bg-muted/20 transition-colors ${isMe ? 'bg-gold/5' : ''}`}>
                    {/* User info */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-navy/10 flex items-center justify-center text-sm font-bold text-navy shrink-0">
                          {user.name[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-navy">
                            {user.name} {isMe && <span className="text-xs text-gold font-normal">(you)</span>}
                          </p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                          {user.phone && <p className="text-xs text-muted-foreground">{user.phone}</p>}
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={`text-xs ${roleCfg.cls}`}>
                        {roleCfg.label}
                      </Badge>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={`text-xs flex items-center gap-1 w-fit ${statusCfg.cls}`}>
                        <statusCfg.icon className="h-3 w-3" />
                        {statusCfg.label}
                      </Badge>
                    </td>

                    {/* Joined */}
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      {isMe ? (
                        <span className="text-xs text-muted-foreground italic pr-2">Your account</span>
                      ) : (
                        <div className="flex items-center gap-1 justify-end flex-wrap">

                          {/* Approve (pending → active) */}
                          {user.status === 'PENDING' && (
                            <Button size="sm" variant="outline"
                              className="h-8 gap-1 border-green-300 text-green-700 hover:bg-green-50 text-xs"
                              disabled={!!loading}
                              onClick={() => patch(user.id, { status: 'ACTIVE' }, `${user.name} approved`)}>
                              {isLoading(user.id, '{"status":"ACTIVE"}')
                                ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                : <CheckCircle className="h-3.5 w-3.5" />}
                              Approve
                            </Button>
                          )}

                          {/* Block / Unblock */}
                          {user.status === 'ACTIVE' && (
                            <Button size="sm" variant="outline"
                              className="h-8 gap-1 border-red-200 text-red-600 hover:bg-red-50 text-xs"
                              disabled={!!loading}
                              onClick={() => patch(user.id, { status: 'BLOCKED' }, `${user.name} blocked`)}>
                              {isLoading(user.id, '{"status":"BLOCKED"}')
                                ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                : <Ban className="h-3.5 w-3.5" />}
                              Block
                            </Button>
                          )}
                          {user.status === 'BLOCKED' && (
                            <Button size="sm" variant="outline"
                              className="h-8 gap-1 border-green-300 text-green-700 hover:bg-green-50 text-xs"
                              disabled={!!loading}
                              onClick={() => patch(user.id, { status: 'ACTIVE' }, `${user.name} unblocked`)}>
                              {isLoading(user.id, '{"status":"ACTIVE"}')
                                ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                : <CheckCircle className="h-3.5 w-3.5" />}
                              Unblock
                            </Button>
                          )}

                          {/* Promote / Demote role */}
                          {user.role === 'STAFF' ? (
                            <Button size="sm" variant="outline"
                              className="h-8 gap-1 text-xs border-navy/30 text-navy hover:bg-navy/5"
                              disabled={!!loading}
                              onClick={() => patch(user.id, { role: 'SUPER_ADMIN' }, `${user.name} promoted to Super Admin`)}>
                              {isLoading(user.id, '{"role":"SUPER_ADMIN"}')
                                ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                : <ShieldCheck className="h-3.5 w-3.5" />}
                              Make Admin
                            </Button>
                          ) : (
                            <Button size="sm" variant="outline"
                              className="h-8 gap-1 text-xs text-muted-foreground hover:text-navy"
                              disabled={!!loading}
                              onClick={() => patch(user.id, { role: 'STAFF' }, `${user.name} changed to Staff`)}>
                              {isLoading(user.id, '{"role":"STAFF"}')
                                ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                : <UserCog className="h-3.5 w-3.5" />}
                              Make Staff
                            </Button>
                          )}

                          {/* Reset password */}
                          <Dialog open={resetTarget?.id === user.id} onOpenChange={open => { if (!open) { setResetTarget(null); setNewPassword(''); } }}>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="ghost"
                                className="h-8 w-8 p-0 text-muted-foreground hover:text-navy"
                                onClick={() => setResetTarget(user)}>
                                <KeyRound className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Reset Password — {user.name}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4 pt-2">
                                <div className="space-y-1.5">
                                  <Label>New Password (min 8 characters)</Label>
                                  <Input type="password" value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                    placeholder="Enter new password" />
                                </div>
                                <div className="flex gap-2 justify-end">
                                  <Button variant="outline" onClick={() => { setResetTarget(null); setNewPassword(''); }}>Cancel</Button>
                                  <Button onClick={resetPassword} className="bg-navy hover:bg-navy-dark text-white"
                                    disabled={!!loading}>
                                    {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                    Reset Password
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>

                          {/* Delete */}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="ghost"
                                className="h-8 w-8 p-0 text-red-400 hover:text-red-600 hover:bg-red-50">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete User</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to permanently delete <strong>{user.name}</strong>?
                                  This cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteUser(user.id)}
                                  className="bg-red-600 hover:bg-red-700">
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>

                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t bg-muted/20 text-xs text-muted-foreground">
          Showing {filtered.length} of {users.length} users
        </div>
      </div>
    </div>
  );
}
