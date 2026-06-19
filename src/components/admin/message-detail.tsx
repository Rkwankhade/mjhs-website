'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Mail, Phone, Check, Trash2 } from 'lucide-react';
export function MessageDetail({ message }: { message: any }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  async function markRead() {
    await fetch(`/api/messages/${message.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'READ' }) });
    router.refresh();
  }
  async function deleteMsg() {
    await fetch(`/api/messages/${message.id}`, { method: 'DELETE' });
    router.refresh();
  }
  return (
    <div className={`p-4 transition-colors ${message.status === 'UNREAD' ? 'bg-blue-50/50' : ''}`}>
      <div className="flex items-start gap-3 cursor-pointer" onClick={() => { setOpen(o => !o); if (message.status === 'UNREAD') markRead(); }}>
        <div className="h-9 w-9 rounded-full bg-navy/10 flex items-center justify-center text-sm font-bold text-navy shrink-0">{message.name[0]}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-sm">{message.name}</span>
            {message.status === 'UNREAD' && <Badge className="bg-blue-100 text-blue-700 text-xs border-blue-200">New</Badge>}
            {message.category && <Badge variant="outline" className="text-xs">{message.category}</Badge>}
            <span className="text-xs text-muted-foreground ml-auto">{new Date(message.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
          <p className="text-sm text-muted-foreground truncate">{message.subject}</p>
        </div>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 shrink-0">{open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}</Button>
      </div>
      {open && (
        <div className="mt-4 pl-12 space-y-3">
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" />{message.email}</span>
            {message.phone && <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{message.phone}</span>}
          </div>
          <p className="text-sm leading-relaxed whitespace-pre-wrap bg-muted/30 rounded-lg p-4">{message.message}</p>
          <div className="flex gap-2">
            {message.status !== 'READ' && <Button size="sm" variant="outline" onClick={markRead} className="gap-1.5 h-7 text-xs"><Check className="h-3 w-3" />Mark Read</Button>}
            <Button size="sm" variant="ghost" onClick={deleteMsg} className="gap-1.5 h-7 text-xs text-red-500 hover:text-red-700"><Trash2 className="h-3 w-3" />Delete</Button>
          </div>
        </div>
      )}
    </div>
  );
}
