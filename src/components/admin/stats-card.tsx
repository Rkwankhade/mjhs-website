import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  description?: string;
  trend?: { value: number; positive: boolean };
  color?: 'navy' | 'gold' | 'green' | 'blue';
}

export function StatsCard({ title, value, icon: Icon, description, color = 'navy' }: StatsCardProps) {
  const colors = {
    navy: 'bg-navy/5 text-navy border-navy/10',
    gold: 'bg-gold/10 text-gold-dark border-gold/20',
    green: 'bg-green-50 text-green-700 border-green-100',
    blue: 'bg-blue-50 text-blue-700 border-blue-100',
  };

  return (
    <div className="rounded-xl border bg-background p-5 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className={cn('p-2 rounded-lg border', colors[color])}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="text-2xl font-bold text-navy">{value}</div>
      {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
    </div>
  );
}
