'use client';

import { signOut } from 'next-auth/react';
import { LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';

interface Props { user: { name?: string | null; email?: string | null } }

export function AdminHeader({ user }: Props) {
  return (
    <header className="h-14 border-b bg-background flex items-center justify-between px-6 shrink-0">
      <div />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2 h-9 px-2">
            <Avatar className="h-7 w-7">
              <AvatarFallback className="bg-navy text-white text-xs">{user.name?.[0] || 'A'}</AvatarFallback>
            </Avatar>
            <span className="text-sm hidden sm:block">{user.name}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <div className="px-3 py-2">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/admin/login' })} className="text-red-600 cursor-pointer">
            <LogOut className="h-4 w-4 mr-2" /> Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
