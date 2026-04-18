'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  LayoutDashboard,
  QrCode,
  Users,
  GraduationCap,
  BookOpen,
  Star,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft
} from 'lucide-react'
import type { User, UserRole } from '@/lib/types'
import { NAV_ITEMS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { NotificationBadge } from '@/components/notifications/notification-center'

interface SidebarProps {
  user: User
  notificationCount: number
  onLogout: () => void
  isOpen: boolean
  onToggle: () => void
}

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard,
  QrCode,
  Users,
  GraduationCap,
  BookOpen,
  Star,
  BarChart3,
  Bell,
  Settings
}

export function Sidebar({ user, notificationCount, onLogout, isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const navItems = NAV_ITEMS[user.role as keyof typeof NAV_ITEMS] || NAV_ITEMS.student

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-300 lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-sidebar-foreground">Bimbel Cerdas</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={onToggle}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* User info */}
          <div className="p-4 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {user.name}
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                  {user.role === 'admin' ? 'Administrator' : user.role}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 py-4">
            <nav className="px-2 space-y-1">
              {navItems.map((item) => {
                const Icon = iconMap[item.icon]
                const isActive = pathname === item.href
                const isNotification = item.icon === 'Bell'

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors relative',
                      isActive
                        ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                    )}
                    onClick={() => {
                      if (window.innerWidth < 1024) onToggle()
                    }}
                  >
                    <div className="relative">
                      {Icon && <Icon className="w-5 h-5" />}
                      {isNotification && <NotificationBadge count={notificationCount} />}
                    </div>
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </nav>
          </ScrollArea>

          {/* Footer */}
          <div className="p-4 border-t border-sidebar-border">
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:text-destructive"
              onClick={onLogout}
            >
              <LogOut className="w-5 h-5 mr-3" />
              Keluar
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile menu button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-30 lg:hidden"
        onClick={onToggle}
      >
        <Menu className="w-5 h-5" />
      </Button>
    </>
  )
}
