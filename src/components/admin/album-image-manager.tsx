'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Plus, Trash2, Loader2, ImageIcon, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
export function AlbumImageManager({ album }: { album: any }) {
  const router = useRouter(); const { toast } = useToast();
  const [images, setImages] = useState<any[]>(album.images);
  const [newUrl, setNewUrl] = useState(''); const [newAlt, setNewAlt] = useState(''); const [newCaption, setNewCaption] = useState(''); const [adding, setAdding] = useState(false);
  async function addImage() {
    if (!newUrl) return; setAdding(true);
    try {
      const res = await fetch('/api/gallery/images',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({albumId:album.id,url:newUrl,alt:newAlt,caption:newCaption,order:images.length})});
      if(!res.ok) throw new Error();
      const img = await res.json();
      setImages(p=>[...p,img]); setNewUrl(''); setNewAlt(''); setNewCaption('');
      toast({title:'Image added'});
    } catch { toast({title:'Error',variant:'destructive'}); }
    finally { setAdding(false); }
  }
  async function removeImage(id: string) {
    try {
      await fetch(`/api/gallery/images/${id}`,{method:'DELETE'});
      setImages(p=>p.filter(i=>i.id!==id));
      toast({title:'Image removed'});
    } catch { toast({title:'Error',variant:'destructive'}); }
  }
  async function setCover(id: string) {
    try {
      await fetch(`/api/gallery/images/${id}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({isCover:true,albumId:album.id})});
      setImages(p=>p.map(i=>({...i,isCover:i.id===id})));
      toast({title:'Cover updated'});
    } catch { toast({title:'Error',variant:'destructive'}); }
  }
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/gallery"><Button variant="ghost" size="sm" className="gap-1.5"><ArrowLeft className="h-4 w-4"/>Back</Button></Link>
        <div><h1 className="font-serif text-xl font-bold text-navy">{album.title}</h1><p className="text-sm text-muted-foreground">{images.length} images</p></div>
        <Badge variant="outline" className={`ml-auto ${album.isPublished?'border-green-300 text-green-700':'border-yellow-300 text-yellow-700'}`}>{album.isPublished?'Published':'Draft'}</Badge>
      </div>
      {/* Add image */}
      <div className="rounded-xl border bg-background p-5 space-y-4">
        <h2 className="font-semibold text-sm">Add Image (via URL)</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          <div className="space-y-1 sm:col-span-3"><Label className="text-xs">Image URL *</Label><Input value={newUrl} onChange={e=>setNewUrl(e.target.value)} placeholder="https://res.cloudinary.com/..."/></div>
          <div className="space-y-1"><Label className="text-xs">Alt text</Label><Input value={newAlt} onChange={e=>setNewAlt(e.target.value)} placeholder="Description"/></div>
          <div className="space-y-1"><Label className="text-xs">Caption</Label><Input value={newCaption} onChange={e=>setNewCaption(e.target.value)} placeholder="Caption"/></div>
          <div className="flex items-end"><Button onClick={addImage} disabled={!newUrl||adding} className="w-full bg-navy hover:bg-navy-dark text-white gap-1.5">{adding?<Loader2 className="h-4 w-4 animate-spin"/>:<Plus className="h-4 w-4"/>}Add</Button></div>
        </div>
      </div>
      {/* Images grid */}
      {images.length===0?(
        <div className="text-center py-12 text-muted-foreground border rounded-xl"><ImageIcon className="h-10 w-10 mx-auto mb-2 opacity-30"/><p>No images yet. Add some above.</p></div>
      ):(
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map(img=>(
            <div key={img.id} className="relative group rounded-lg overflow-hidden border bg-muted aspect-square">
              <Image src={img.url} alt={img.alt||'Image'} fill className="object-cover"/>
              {img.isCover && <div className="absolute top-1.5 left-1.5"><Badge className="bg-gold text-navy text-xs gap-1"><Star className="h-2.5 w-2.5"/>Cover</Badge></div>}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {!img.isCover && <Button size="sm" variant="secondary" onClick={()=>setCover(img.id)} className="h-7 text-xs gap-1"><Star className="h-3 w-3"/>Cover</Button>}
                <Button size="sm" variant="destructive" onClick={()=>removeImage(img.id)} className="h-7 w-7 p-0"><Trash2 className="h-3.5 w-3.5"/></Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
