'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus } from 'lucide-react';

interface Column<T> { key: keyof T | string; label: string; render?: (item: T) => React.ReactNode }
interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchKeys?: (keyof T)[];
  createHref?: string;
  createLabel?: string;
  actions?: (item: T) => React.ReactNode;
  emptyMessage?: string;
}

export function DataTable<T extends { id: string }>({ data, columns, searchKeys, createHref, createLabel, actions, emptyMessage }: DataTableProps<T>) {
  const [search, setSearch] = useState('');

  const filtered = search && searchKeys
    ? data.filter(item => searchKeys.some(k => String(item[k] ?? '').toLowerCase().includes(search.toLowerCase())))
    : data;

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-4">
        {searchKeys && (
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
        )}
        {createHref && (
          <Link href={createHref}>
            <Button className="bg-navy hover:bg-navy-dark text-white gap-1.5">
              <Plus className="h-4 w-4" /> {createLabel || 'Create'}
            </Button>
          </Link>
        )}
      </div>
      <div className="rounded-xl border bg-background overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40">
                {columns.map(col => (
                  <th key={String(col.key)} className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wide">{col.label}</th>
                ))}
                {actions && <th className="text-right px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wide">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.length === 0 ? (
                <tr><td colSpan={columns.length + (actions ? 1 : 0)} className="text-center py-10 text-muted-foreground">{emptyMessage || 'No records found.'}</td></tr>
              ) : filtered.map(item => (
                <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                  {columns.map(col => (
                    <td key={String(col.key)} className="px-4 py-3">
                      {col.render ? col.render(item) : String(item[col.key as keyof T] ?? '')}
                    </td>
                  ))}
                  {actions && <td className="px-4 py-3 text-right">{actions(item)}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t bg-muted/20 text-xs text-muted-foreground">
          {filtered.length} of {data.length} records
        </div>
      </div>
    </div>
  );
}
