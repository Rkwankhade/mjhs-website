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
interface AchievementFormProps { achievement?: any; mode: 'create'|'edit' }
export function AchievementForm({ achievement, mode }: AchievementFormProps) {
  const router = useRouter(); const { toast } = useToast(); const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: achievement?.title||'', description: achievement?.description||'', category: achievement?.category||'ACADEMIC', level: achievement?.level||'SCHOOL', year: achievement?.year||new Date().getFullYear(), studentName: achievement?.studentName||'', teacherName: achievement?.teacherName||'', isFeatured: achievement?.isFeatured||false, order: achievement?.order||0 });
  const set = (k:string,v:any) => setForm(p=>({...p,[k]:v}));
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true);
    const url = mode==='edit'?`/api/achievements/${achievement.id}`:'/api/achievements';
    const method = mode==='edit'?'PATCH':'POST';
    try {
      const res = await fetch(url,{method,headers:{'Content-Type':'application/json'},body:JSON.stringify({...form,year:Number(form.year),order:Number(form.order)})});
      if(!res.ok) throw new Error();
      toast({title:mode==='edit'?'Achievement updated':'Achievement created'});
      router.push('/admin/achievements'); router.refresh();
    } catch { toast({title:'Error',variant:'destructive'}); }
    finally { setLoading(false); }
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4 mb-2">
        <Link href="/admin/achievements"><Button variant="ghost" size="sm" className="gap-1.5"><ArrowLeft className="h-4 w-4"/>Back</Button></Link>
        <h1 className="font-serif text-2xl font-bold text-navy">{mode==='edit'?'Edit Achievement':'New Achievement'}</h1>
      </div>
      <div className="rounded-xl border bg-background p-6 space-y-5">
        <div className="space-y-1.5"><Label>Title *</Label><Input required value={form.title} onChange={e=>set('title',e.target.value)} placeholder="Achievement title"/></div>
        <div className="space-y-1.5"><Label>Description</Label><Textarea rows={4} value={form.description} onChange={e=>set('description',e.target.value)} placeholder="Details..."/></div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="space-y-1.5"><Label>Category</Label>
            <Select value={form.category} onValueChange={v=>set('category',v)}><SelectTrigger><SelectValue/></SelectTrigger>
              <SelectContent>{['ACADEMIC','SPORTS','CULTURAL','SCIENCE','ARTS','OTHER'].map(c=><SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-1.5"><Label>Level</Label>
            <Select value={form.level} onValueChange={v=>set('level',v)}><SelectTrigger><SelectValue/></SelectTrigger>
              <SelectContent>{['SCHOOL','DISTRICT','STATE','NATIONAL','INTERNATIONAL'].map(l=><SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-1.5"><Label>Year *</Label><Input required type="number" min="1965" max="2099" value={form.year} onChange={e=>set('year',e.target.value)}/></div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5"><Label>Student Name</Label><Input value={form.studentName} onChange={e=>set('studentName',e.target.value)} placeholder="Student name (optional)"/></div>
          <div className="space-y-1.5"><Label>Teacher/Guide</Label><Input value={form.teacherName} onChange={e=>set('teacherName',e.target.value)} placeholder="Teacher name (optional)"/></div>
        </div>
        <div className="flex items-center gap-3"><Switch id="feat" checked={form.isFeatured} onCheckedChange={v=>set('isFeatured',v)}/><Label htmlFor="feat">Feature on homepage</Label></div>
      </div>
      <Button type="submit" disabled={loading} className="bg-navy hover:bg-navy-dark text-white">
        {loading?<><Loader2 className="h-4 w-4 mr-2 animate-spin"/>Saving...</>:mode==='edit'?'Update':'Create Achievement'}
      </Button>
    </form>
  );
}
