'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, ArrowLeft } from 'lucide-react';
interface AlbumFormProps { album?: any; mode: 'create'|'edit' }
export function AlbumForm({ album, mode }: AlbumFormProps) {
  const router = useRouter(); const { toast } = useToast(); const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: album?.title||'', description: album?.description||'', category: album?.category||'EVENTS', isPublished: album?.isPublished??false, eventDate: album?.eventDate ? new Date(album.eventDate).toISOString().slice(0,10) : '' });
  const set = (k:string,v:any) => setForm(p=>({...p,[k]:v}));
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true);
    const url = mode==='edit'?`/api/gallery/albums/${album.id}`:'/api/gallery/albums';
    const method = mode==='edit'?'PATCH':'POST';
    try {
      const res = await fetch(url,{method,headers:{'Content-Type':'application/json'},body:JSON.stringify({...form,eventDate:form.eventDate||null})});
      if(!res.ok) throw new Error();
      const data = await res.json();
      toast({title:mode==='edit'?'Album updated':'Album created'});
      if(mode==='create') router.push(`/admin/gallery/albums/${data.id}`);
      else { router.push('/admin/gallery'); router.refresh(); }
    } catch { toast({title:'Error',variant:'destructive'}); }
    finally { setLoading(false); }
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4 mb-2">
        <Link href="/admin/gallery"><Button variant="ghost" size="sm" className="gap-1.5"><ArrowLeft className="h-4 w-4"/>Back</Button></Link>
        <h1 className="font-serif text-2xl font-bold text-navy">{mode==='edit'?'Edit Album':'New Album'}</h1>
      </div>
      <div className="rounded-xl border bg-background p-6 space-y-5">
        <div className="space-y-1.5"><Label>Title *</Label><Input required value={form.title} onChange={e=>set('title',e.target.value)} placeholder="Album title"/></div>
        <div className="space-y-1.5"><Label>Description</Label><Textarea rows={3} value={form.description} onChange={e=>set('description',e.target.value)} placeholder="Album description..."/></div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5"><Label>Category</Label>
            <Select value={form.category} onValueChange={v=>set('category',v)}><SelectTrigger><SelectValue/></SelectTrigger>
              <SelectContent>{['EVENTS','SPORTS','ACADEMICS','CULTURAL','INFRASTRUCTURE','OTHER'].map(c=><SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-1.5"><Label>Event Date</Label><Input type="date" value={form.eventDate} onChange={e=>set('eventDate',e.target.value)}/></div>
        </div>
        <div className="flex items-center gap-2"><Switch id="pub" checked={form.isPublished} onCheckedChange={v=>set('isPublished',v)}/><Label htmlFor="pub">Publish album</Label></div>
      </div>
      <Button type="submit" disabled={loading} className="bg-navy hover:bg-navy-dark text-white">
        {loading?<><Loader2 className="h-4 w-4 mr-2 animate-spin"/>Saving...</>:mode==='edit'?'Update Album':'Create Album'}
      </Button>
    </form>
  );
}
