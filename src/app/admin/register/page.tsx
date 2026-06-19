'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GraduationCap, Loader2, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirm) {
      toast({ title: 'Passwords do not match', variant: 'destructive' }); return;
    }
    if (form.password.length < 8) {
      toast({ title: 'Password must be at least 8 characters', variant: 'destructive' }); return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/admin/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setDone(true);
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally { setLoading(false); }
  }

  if (done) return (
    <div className="min-h-screen flex items-center justify-center bg-navy p-4">
      <div className="bg-white rounded-xl p-10 text-center max-w-md w-full shadow-xl">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h2 className="font-serif text-2xl font-bold text-navy mb-2">Request Submitted!</h2>
        <p className="text-muted-foreground text-sm mb-6">
          Your account request has been sent to the Super Admin for approval. You'll be able to login once approved.
        </p>
        <Link href="/admin/login">
          <Button className="bg-navy hover:bg-navy-dark text-white w-full">Back to Login</Button>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-gold text-navy mb-4">
            <GraduationCap className="h-8 w-8" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-white">Request Access</h1>
          <p className="text-navy-200 mt-1 text-sm">M.J. High School Admin Portal</p>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Full Name *</Label>
              <Input required value={form.name} onChange={e => set('name', e.target.value)} placeholder="Your full name" />
            </div>
            <div className="space-y-1.5">
              <Label>Email Address *</Label>
              <Input required type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@email.com" />
            </div>
            <div className="space-y-1.5">
              <Label>Phone Number</Label>
              <Input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+91 XXXXX XXXXX" />
            </div>
            <div className="space-y-1.5">
              <Label>Password *</Label>
              <Input required type="password" value={form.password} onChange={e => set('password', e.target.value)} placeholder="Minimum 8 characters" />
            </div>
            <div className="space-y-1.5">
              <Label>Confirm Password *</Label>
              <Input required type="password" value={form.confirm} onChange={e => set('confirm', e.target.value)} placeholder="Repeat password" />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-navy hover:bg-navy-dark text-white mt-2">
              {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Submitting...</> : 'Request Access'}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <Link href="/admin/login" className="text-xs text-muted-foreground hover:text-navy flex items-center justify-center gap-1">
              <ArrowLeft className="h-3 w-3" /> Back to Login
            </Link>
          </div>
        </div>
        <p className="text-center text-xs text-navy-300 mt-4">
          Your request will be reviewed by the Super Admin
        </p>
      </div>
    </div>
  );
}
