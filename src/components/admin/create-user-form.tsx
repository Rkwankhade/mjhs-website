'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Loader2 } from 'lucide-react';

export function CreateUserForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', role: 'STAFF' });
  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password.length < 8) {
      toast({ title: 'Password must be at least 8 characters', variant: 'destructive' }); return;
    }
    setLoading(true);
    try {
      // Use register endpoint but then immediately approve
      const res1 = await fetch('/api/admin/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, password: form.password }),
      });
      const d1 = await res1.json();
      if (!res1.ok) throw new Error(d1.error);

      // Get the new user and approve + set role
      const res2 = await fetch('/api/admin/users');
      const users = await res2.json();
      const newUser = users.find((u: any) => u.email === form.email);
      if (newUser) {
        await fetch(`/api/admin/users/${newUser.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'ACTIVE', role: form.role }),
        });
      }

      toast({ title: 'User created and activated!' });
      router.push('/admin/users');
      router.refresh();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally { setLoading(false); }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border bg-background p-6 space-y-5">
      <div className="flex items-center gap-3 mb-2">
        <Link href="/admin/users"><Button variant="ghost" size="sm" className="gap-1.5"><ArrowLeft className="h-4 w-4"/>Back</Button></Link>
      </div>
      <div className="space-y-1.5">
        <Label>Full Name *</Label>
        <Input required value={form.name} onChange={e => set('name', e.target.value)} placeholder="Staff member's name" />
      </div>
      <div className="space-y-1.5">
        <Label>Email *</Label>
        <Input required type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="staff@mjhskaranja.edu.in" />
      </div>
      <div className="space-y-1.5">
        <Label>Phone</Label>
        <Input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+91 XXXXX XXXXX" />
      </div>
      <div className="space-y-1.5">
        <Label>Role</Label>
        <Select value={form.role} onValueChange={v => set('role', v)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="STAFF">Staff (can manage content)</SelectItem>
            <SelectItem value="SUPER_ADMIN">Super Admin (full access)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label>Password * (min 8 chars)</Label>
        <Input required type="password" value={form.password} onChange={e => set('password', e.target.value)} placeholder="Set a strong password" />
      </div>
      <p className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
        ℹ️ This user will be immediately activated. Share the email and password with them directly.
      </p>
      <Button type="submit" disabled={loading} className="w-full bg-navy hover:bg-navy-dark text-white">
        {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin"/>Creating...</> : 'Create & Activate User'}
      </Button>
    </form>
  );
}
