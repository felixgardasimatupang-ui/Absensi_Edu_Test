'use client'

import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { id as localeId } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Bell, CheckCheck, QrCode, Star, Clock, Megaphone, Settings } from 'lucide-react'
import type { Notification, NotificationType } from '@/lib/types'
import { cn } from '@/lib/utils'

interface NotificationCenterProps {
  notifications: Notification[]
  onMarkAsRead: (id: string) => void
  onMarkAllAsRead: () => void
}

const notificationIcons: Record<NotificationType, React.ReactNode> = {
  attendance: <QrCode className="w-4 h-4" />,
  evaluation: <Star className="w-4 h-4" />,
  reminder: <Clock className="w-4 h-4" />,
  announcement: <Megaphone className="w-4 h-4" />,
  system: <Settings className="w-4 h-4" />
}

const notificationColors: Record<NotificationType, string> = {
  attendance: 'bg-emerald-100 text-emerald-600',
  evaluation: 'bg-amber-100 text-amber-600',
  reminder: 'bg-blue-100 text-blue-600',
  announcement: 'bg-purple-100 text-purple-600',
  system: 'bg-gray-100 text-gray-600'
}

function NotificationItem({ notification, onMarkAsRead }: { notification: Notification; onMarkAsRead: (id: string) => void }) {
  return (
    <div
      className={cn('p-4 border-b last:border-b-0 transition-colors cursor-pointer hover:bg-muted/50', !notification.read && 'bg-primary/5')}
      onClick={() => !notification.read && onMarkAsRead(notification.id)}
    >
      <div className="flex gap-3">
        <div className={cn('w-10 h-10 rounded-full flex items-center justify-center shrink-0', notificationColors[notification.type])}>
          {notificationIcons[notification.type]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className={cn('text-sm font-medium truncate', !notification.read && 'font-semibold')}>{notification.title}</h4>
            {!notification.read && <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">{notification.message}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: localeId })}
          </p>
        </div>
      </div>
    </div>
  )
}

export function NotificationCenter({ notifications, onMarkAsRead, onMarkAllAsRead }: NotificationCenterProps) {
  const [activeTab, setActiveTab] = useState<'all' | NotificationType>('all')
  const filteredNotifications = activeTab === 'all' ? notifications : notifications.filter((n) => n.type === activeTab)
  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Bell className="w-4 h-4 text-primary" />
              </div>
              Notifikasi
            </CardTitle>
            <CardDescription className="mt-1">{unreadCount > 0 ? `${unreadCount} belum dibaca` : 'Semua sudah dibaca'}</CardDescription>
          </div>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={onMarkAllAsRead}>
              <CheckCheck className="w-4 h-4 mr-1" />
              Tandai Semua
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
          <div className="px-6 border-b">
            <TabsList className="w-full justify-start h-auto p-0 bg-transparent">
              <TabsTrigger value="all" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2">Semua</TabsTrigger>
              <TabsTrigger value="attendance" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2">Absensi</TabsTrigger>
              <TabsTrigger value="evaluation" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2">Evaluasi</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value={activeTab} className="m-0">
            <ScrollArea className="h-[400px]">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((notification) => <NotificationItem key={notification.id} notification={notification} onMarkAsRead={onMarkAsRead} />)
              ) : (
                <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
                  <Bell className="w-12 h-12 mb-2 opacity-20" />
                  <p className="text-sm">Tidak ada notifikasi</p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export function NotificationBadge({ count }: { count: number }) {
  if (count === 0) return null
  return (
    <Badge variant="destructive" className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs">
      {count > 9 ? '9+' : count}
    </Badge>
  )
}
