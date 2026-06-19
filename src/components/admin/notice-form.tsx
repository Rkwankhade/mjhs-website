'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface NoticeFormProps { notice?: any; mode: 'create' | 'edit' }

export function NoticeForm({ notice, mode }: NoticeFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: notice?.title || '',
    content: notice?.content || '',
    category: notice?.category || 'GENERAL',
    status: notice?.status || 'DRAFT',
    isPinned: notice?.isPinned || false,
    expiresAt: notice?.expiresAt ? new Date(notice.expiresAt).toISOString().slice(0, 10) : '',
    pdfUrl: notice?.pdfUrl || '',
  });

  const set = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const url = mode === 'edit' ? `/api/notices/${notice.id}` : '/api/notices';
    const method = mode === 'edit' ? 'PATCH' : 'POST';
    try {
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, expiresAt: form.expiresAt || null }) });
      if (!res.ok) throw new Error();
      toast({ title: mode === 'edit' ? 'Notice updated' : 'Notice created' });
      router.push('/admin/notices');
      router.refresh();
    } catch {
      toast({ title: 'Error', description: 'Something went wrong.', variant: 'destructive' });
    } finally { setLoading(false); }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4 mb-2">
        <Link href="/admin/notices"><Button variant="ghost" size="sm" className="gap-1.5"><ArrowLeft className="h-4 w-4" />Back</Button></Link>
        <h1 className="font-serif text-2xl font-bold text-navy">{mode === 'edit' ? 'Edit Notice' : 'New Notice'}</h1>
      </div>
      <div className="rounded-xl border bg-background p-6 space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="title">Title *</Label>
          <Input id="title" required value={form.title} onChange={e => set('title', e.target.value)} placeholder="Notice title" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="content">Content *</Label>
          <Textarea id="content" required rows={8} value={form.content} onChange={e => set('content', e.target.value)} placeholder="Notice content..." />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Category</Label>
            <Select value={form.category} onValueChange={v => set('category', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{['GENERAL','ACADEMIC','EXAM','SPORTS','CULTURAL','HOLIDAY','ADMISSION','RESULT'].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={v => set('status', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{['DRAFT','PUBLISHED','ARCHIVED'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="expiresAt">Expires At</Label>
            <Input id="expiresAt" type="date" value={form.expiresAt} onChange={e => set('expiresAt', e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pdfUrl">PDF URL</Label>
            <Input id="pdfUrl" value={form.pdfUrl} onChange={e => set('pdfUrl', e.target.value)} placeholder="https://..." />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Switch id="pinned" checked={form.isPinned} onCheckedChange={v => set('isPinned', v)} />
          <Label htmlFor="pinned">Pin this notice</Label>
        </div>
      </div>
      <Button type="submit" disabled={loading} className="bg-navy hover:bg-navy-dark text-white">
        {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</> : mode === 'edit' ? 'Update Notice' : 'Create Notice'}
      </Button>
    </form>
  );
}
