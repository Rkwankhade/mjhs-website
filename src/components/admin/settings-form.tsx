'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
export function SettingsForm({ settings }: { settings: any }) {
  const { toast } = useToast(); const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ schoolName: settings?.schoolName||'M.J. High School', tagline: settings?.tagline||'Nurturing Minds, Building Futures', address: settings?.address||'', phone: settings?.phone||'', email: settings?.email||'', principalName: settings?.principalName||'', founded: settings?.founded||1965, facebookUrl: settings?.facebookUrl||'', youtubeUrl: settings?.youtubeUrl||'' });
  const set = (k:string,v:any) => setForm(p=>({...p,[k]:v}));
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true);
    try {
      const res = await fetch('/api/settings',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...form,founded:Number(form.founded)})});
      if(!res.ok) throw new Error();
      toast({title:'Settings saved'});
    } catch { toast({title:'Error',variant:'destructive'}); }
    finally { setLoading(false); }
  }
  return (
    <form onSubmit={handleSubmit} className="rounded-xl border bg-background p-6 space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5"><Label>School Name</Label><Input value={form.schoolName} onChange={e=>set('schoolName',e.target.value)}/></div>
        <div className="space-y-1.5"><Label>Tagline</Label><Input value={form.tagline} onChange={e=>set('tagline',e.target.value)}/></div>
      </div>
      <div className="space-y-1.5"><Label>Address</Label><Textarea rows={2} value={form.address} onChange={e=>set('address',e.target.value)}/></div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5"><Label>Phone</Label><Input value={form.phone} onChange={e=>set('phone',e.target.value)}/></div>
        <div className="space-y-1.5"><Label>Email</Label><Input type="email" value={form.email} onChange={e=>set('email',e.target.value)}/></div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5"><Label>Principal Name</Label><Input value={form.principalName} onChange={e=>set('principalName',e.target.value)}/></div>
        <div className="space-y-1.5"><Label>Year Founded</Label><Input type="number" value={form.founded} onChange={e=>set('founded',e.target.value)}/></div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5"><Label>Facebook URL</Label><Input value={form.facebookUrl} onChange={e=>set('facebookUrl',e.target.value)} placeholder="https://facebook.com/..."/></div>
        <div className="space-y-1.5"><Label>YouTube URL</Label><Input value={form.youtubeUrl} onChange={e=>set('youtubeUrl',e.target.value)} placeholder="https://youtube.com/..."/></div>
      </div>
      <Button type="submit" disabled={loading} className="bg-navy hover:bg-navy-dark text-white">
        {loading?<><Loader2 className="h-4 w-4 mr-2 animate-spin"/>Saving...</>:'Save Settings'}
      </Button>
    </form>
  );
}
