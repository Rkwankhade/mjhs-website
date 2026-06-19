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
interface FacultyFormProps { faculty?: any; mode: 'create'|'edit' }
export function FacultyForm({ faculty, mode }: FacultyFormProps) {
  const router = useRouter(); const { toast } = useToast(); const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: faculty?.name||'', designation: faculty?.designation||'', department: faculty?.department||'Science', qualification: faculty?.qualification||'', experience: faculty?.experience||0, bio: faculty?.bio||'', email: faculty?.email||'', phone: faculty?.phone||'', image: faculty?.image||'', isActive: faculty?.isActive??true, isFeatured: faculty?.isFeatured||false, order: faculty?.order||0 });
  const set = (k:string,v:any) => setForm(p=>({...p,[k]:v}));
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true);
    const url = mode==='edit'?`/api/faculty/${faculty.id}`:'/api/faculty';
    const method = mode==='edit'?'PATCH':'POST';
    try {
      const res = await fetch(url,{method,headers:{'Content-Type':'application/json'},body:JSON.stringify({...form,experience:Number(form.experience),order:Number(form.order)})});
      if(!res.ok) throw new Error();
      toast({title:mode==='edit'?'Faculty updated':'Faculty added'});
      router.push('/admin/faculty'); router.refresh();
    } catch { toast({title:'Error',variant:'destructive'}); }
    finally { setLoading(false); }
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4 mb-2">
        <Link href="/admin/faculty"><Button variant="ghost" size="sm" className="gap-1.5"><ArrowLeft className="h-4 w-4"/>Back</Button></Link>
        <h1 className="font-serif text-2xl font-bold text-navy">{mode==='edit'?'Edit Faculty':'Add Faculty'}</h1>
      </div>
      <div className="rounded-xl border bg-background p-6 space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5"><Label>Full Name *</Label><Input required value={form.name} onChange={e=>set('name',e.target.value)} placeholder="e.g. Dr. Rajesh Sharma"/></div>
          <div className="space-y-1.5"><Label>Designation *</Label><Input required value={form.designation} onChange={e=>set('designation',e.target.value)} placeholder="e.g. Senior Teacher"/></div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5"><Label>Department</Label>
            <Select value={form.department} onValueChange={v=>set('department',v)}><SelectTrigger><SelectValue/></SelectTrigger>
              <SelectContent>{['Science','Mathematics','Social Science','Languages','Commerce','Physical Education','Arts','Administration'].map(d=><SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-1.5"><Label>Qualification</Label><Input value={form.qualification} onChange={e=>set('qualification',e.target.value)} placeholder="e.g. M.Sc., B.Ed."/></div>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="space-y-1.5"><Label>Experience (yrs)</Label><Input type="number" min="0" value={form.experience} onChange={e=>set('experience',e.target.value)}/></div>
          <div className="space-y-1.5"><Label>Email</Label><Input type="email" value={form.email} onChange={e=>set('email',e.target.value)} placeholder="teacher@school.edu.in"/></div>
          <div className="space-y-1.5"><Label>Phone</Label><Input value={form.phone} onChange={e=>set('phone',e.target.value)} placeholder="+91 XXXXX XXXXX"/></div>
        </div>
        <div className="space-y-1.5"><Label>Bio</Label><Textarea rows={3} value={form.bio} onChange={e=>set('bio',e.target.value)} placeholder="Short bio..."/></div>
        <div className="space-y-1.5"><Label>Photo URL</Label><Input value={form.image} onChange={e=>set('image',e.target.value)} placeholder="https://..."/></div>
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-2"><Switch id="active" checked={form.isActive} onCheckedChange={v=>set('isActive',v)}/><Label htmlFor="active">Active</Label></div>
          <div className="flex items-center gap-2"><Switch id="feat" checked={form.isFeatured} onCheckedChange={v=>set('isFeatured',v)}/><Label htmlFor="feat">Featured</Label></div>
        </div>
      </div>
      <Button type="submit" disabled={loading} className="bg-navy hover:bg-navy-dark text-white">
        {loading?<><Loader2 className="h-4 w-4 mr-2 animate-spin"/>Saving...</>:mode==='edit'?'Update Faculty':'Add Faculty'}
      </Button>
    </form>
  );
}
