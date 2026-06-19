'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { GraduationCap, Loader2, ShieldCheck, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const result = await signIn('credentials', { ...form, redirect: false });
    if (result?.error) {
      toast({
        title: 'Login Failed',
        description: 'Invalid credentials, or your account is pending approval / blocked. Contact the administrator.',
        variant: 'destructive',
      });
      setLoading(false);
    } else {
      router.push('/admin/dashboard');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-gold text-navy mb-4">
            <GraduationCap className="h-8 w-8" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-white">M.J. High School</h1>
          <p className="text-navy-200 mt-1 text-sm flex items-center justify-center gap-1.5">
            <ShieldCheck className="h-4 w-4" /> Admin Portal
          </p>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" required autoComplete="email"
                value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                placeholder="you@mjhskaranja.edu.in" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required autoComplete="current-password"
                value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                placeholder="••••••••" />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-navy hover:bg-navy-dark text-white">
              {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Signing in...</> : 'Sign In'}
            </Button>
          </form>

          <div className="mt-5 pt-5 border-t text-center">
            <p className="text-xs text-muted-foreground mb-2">Don't have an account?</p>
            <Link href="/admin/register">
              <Button variant="outline" size="sm" className="gap-1.5 w-full">
                <UserPlus className="h-4 w-4" /> Request Access
              </Button>
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-navy-300 mt-4">
          New accounts require approval from the Super Admin
        </p>
      </div>
    </div>
  );
}
