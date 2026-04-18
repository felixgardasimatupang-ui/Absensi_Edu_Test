'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Bell, Search, Settings, User as UserIcon, LogOut } from 'lucide-react'
import type { User } from '@/lib/types'
import { NotificationBadge } from '@/components/notifications/notification-center'

interface HeaderProps {
  user: User
  notificationCount: number
  onLogout: () => void
  title?: string
}

export function Header({ user, notificationCount, onLogout, title }: HeaderProps) {
  return (
    <header className="h-16 border-b bg-card/50 backdrop-blur-sm sticky top-0 z-20">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Title or Search */}
        <div className="flex items-center gap-4 flex-1">
          {title ? (
            <h1 className="text-xl font-semibold hidden sm:block">{title}</h1>
          ) : (
            <div className="relative max-w-md flex-1 hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Cari siswa, kelas, atau tutor..."
                className="pl-10 bg-muted/50"
              />
            </div>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link href="/dashboard/notifications">
              <Bell className="w-5 h-5" />
              <NotificationBadge count={notificationCount} />
            </Link>
          </Button>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 px-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                    {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline text-sm font-medium">
                  {user.name.split(' ')[0]}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile">
                  <UserIcon className="w-4 h-4 mr-2" />
                  Profil Saya
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings">
                  <Settings className="w-4 h-4 mr-2" />
                  Pengaturan
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout} className="text-destructive focus:text-destructive">
                <LogOut className="w-4 h-4 mr-2" />
                Keluar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
