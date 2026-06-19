import { Metadata } from 'next';
import { SettingsForm } from '@/components/admin/settings-form';
import { prisma } from '@/lib/db';
export const metadata: Metadata = { title: 'Settings – Admin' };
export default async function SettingsPage() {
  const settings = await prisma.siteSettings.findFirst();
  return (
    <div className="space-y-6 max-w-2xl">
      <div><h1 className="font-serif text-2xl font-bold text-navy">Settings</h1><p className="text-sm text-muted-foreground mt-1">Manage site-wide settings and information</p></div>
      <SettingsForm settings={settings ? JSON.parse(JSON.stringify(settings)) : null} />
    </div>
  );
}
