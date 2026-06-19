'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, ArrowLeft } from 'lucide-react';
interface EventFormProps { event?: any; mode: 'create' | 'edit' }
export function EventForm({ event, mode }: EventFormProps) {
  const router = useRouter(); const { toast } = useToast(); const [loading, setLoading] = useState(false);
  const toDateInput = (d?: any) => d ? new Date(d).toISOString().slice(0,10) : '';
  const [form, setForm] = useState({ title: event?.title||'', description: event?.description||'', category: event?.category||'ACADEMIC', status: event?.status||'UPCOMING', venue: event?.venue||'', startDate: toDateInput(event?.startDate), endDate: toDateInput(event?.endDate) });
  const set = (k:string,v:any) => setForm(p=>({...p,[k]:v}));
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true);
    const url = mode==='edit' ? `/api/events/${event.id}` : '/api/events';
    const method = mode==='edit' ? 'PATCH' : 'POST';
    try {
      const res = await fetch(url,{method,headers:{'Content-Type':'application/json'},body:JSON.stringify({...form,endDate:form.endDate||null})});
      if(!res.ok) throw new Error();
      toast({title:mode==='edit'?'Event updated':'Event created'});
      router.push('/admin/events'); router.refresh();
    } catch { toast({title:'Error',description:'Something went wrong.',variant:'destructive'}); }
    finally { setLoading(false); }
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4 mb-2">
        <Link href="/admin/events"><Button variant="ghost" size="sm" className="gap-1.5"><ArrowLeft className="h-4 w-4"/>Back</Button></Link>
        <h1 className="font-serif text-2xl font-bold text-navy">{mode==='edit'?'Edit Event':'New Event'}</h1>
      </div>
      <div className="rounded-xl border bg-background p-6 space-y-5">
        <div className="space-y-1.5"><Label>Title *</Label><Input required value={form.title} onChange={e=>set('title',e.target.value)} placeholder="Event title"/></div>
        <div className="space-y-1.5"><Label>Description</Label><Textarea rows={5} value={form.description} onChange={e=>set('description',e.target.value)} placeholder="Event details..."/></div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5"><Label>Category</Label>
            <Select value={form.category} onValueChange={v=>set('category',v)}><SelectTrigger><SelectValue/></SelectTrigger>
              <SelectContent>{['GENERAL','ACADEMIC','SPORTS','CULTURAL','HOLIDAY','EXAMINATION','ADMISSION','OTHER'].map(c=><SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-1.5"><Label>Status</Label>
            <Select value={form.status} onValueChange={v=>set('status',v)}><SelectTrigger><SelectValue/></SelectTrigger>
              <SelectContent>{['UPCOMING','ONGOING','COMPLETED','CANCELLED'].map(s=><SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></div>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="space-y-1.5"><Label>Venue</Label><Input value={form.venue} onChange={e=>set('venue',e.target.value)} placeholder="School Auditorium"/></div>
          <div className="space-y-1.5"><Label>Start Date *</Label><Input required type="date" value={form.startDate} onChange={e=>set('startDate',e.target.value)}/></div>
          <div className="space-y-1.5"><Label>End Date</Label><Input type="date" value={form.endDate} onChange={e=>set('endDate',e.target.value)}/></div>
        </div>
      </div>
      <Button type="submit" disabled={loading} className="bg-navy hover:bg-navy-dark text-white">
        {loading?<><Loader2 className="h-4 w-4 mr-2 animate-spin"/>Saving...</>:mode==='edit'?'Update Event':'Create Event'}
      </Button>
    </form>
  );
}
