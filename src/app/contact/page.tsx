'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PageHeader } from '@/components/shared/page-header';
import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { MapPin, Phone, Mail, Clock, Loader2 } from 'lucide-react';

export default function ContactPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', category: '', message: '' });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error('Failed to send message');
      toast({ title: 'Message sent!', description: "We'll get back to you within 2 working days." });
      setForm({ name: '', email: '', phone: '', subject: '', category: '', message: '' });
    } catch {
      toast({ title: 'Error', description: 'Could not send message. Please try again.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header />
      <main>
        <PageHeader title="Contact Us" subtitle="We'd love to hear from you" breadcrumbs={[{ label: 'Contact' }]} />
        <section className="section-padding">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Info */}
              <ScrollReveal>
                <div>
                  <h2 className="font-serif text-2xl font-bold text-navy mb-6">Get in Touch</h2>
                  <div className="space-y-5">
                    {[
                      { icon: MapPin, title: 'Address', lines: ['M.J. High School, Main Road', 'Karanja Lad, Washim – 444105', 'Maharashtra, India'] },
                      { icon: Phone, title: 'Phone', lines: ['+91 7xxx-xxxxxx', '+91 9xxx-xxxxxx'] },
                      { icon: Mail, title: 'Email', lines: ['info@mjhskaranja.edu.in', 'principal@mjhskaranja.edu.in'] },
                      { icon: Clock, title: 'Office Hours', lines: ['Monday – Saturday: 8:00 AM – 4:00 PM', 'Sunday: Closed'] },
                    ].map((item) => (
                      <div key={item.title} className="flex gap-4 p-4 rounded-lg border bg-background">
                        <div className="h-10 w-10 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                          <item.icon className="h-5 w-5 text-gold" />
                        </div>
                        <div>
                          <p className="font-semibold text-navy text-sm">{item.title}</p>
                          {item.lines.map(l => <p key={l} className="text-sm text-muted-foreground">{l}</p>)}
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Map embed placeholder */}
                  <div className="mt-6 rounded-xl overflow-hidden border h-56 bg-muted flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <MapPin className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-sm">Karanja Lad, Washim District, Maharashtra</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              {/* Form */}
              <ScrollReveal delay={100}>
                <div className="rounded-xl border p-6 md:p-8 bg-background">
                  <h2 className="font-serif text-2xl font-bold text-navy mb-6">Send a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input id="name" required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Your name" />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="email">Email *</Label>
                        <Input id="email" type="email" required value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="your@email.com" />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+91 XXXXX XXXXX" />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Category</Label>
                        <Select onValueChange={val => setForm(p => ({ ...p, category: val }))}>
                          <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                          <SelectContent>
                            {['GENERAL', 'ADMISSION', 'ACADEMIC', 'COMPLAINT', 'SUGGESTION', 'OTHER'].map(c => (
                              <SelectItem key={c} value={c}>{c}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="subject">Subject *</Label>
                      <Input id="subject" required value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} placeholder="Message subject" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea id="message" required rows={5} value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} placeholder="Your message..." />
                    </div>
                    <Button type="submit" disabled={loading} className="w-full bg-navy hover:bg-navy-dark">
                      {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Sending...</> : 'Send Message'}
                    </Button>
                  </form>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
