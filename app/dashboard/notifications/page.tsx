'use client'

import { useAuth } from '@/hooks/use-auth'
import { useNotifications } from '@/hooks/use-notifications'
import { NotificationCenter } from '@/components/notifications/notification-center'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { WhatsAppButton, ContactAdminButton } from '@/components/notifications/whatsapp-button'
import { EmailButton, EmailAdminButton } from '@/components/notifications/email-button'
import { MessageCircle, Mail, Bell, Phone } from 'lucide-react'
import { ADMIN_CONTACT } from '@/lib/constants'

export default function NotificationsPage() {
  const { user } = useAuth()
  const {
    notifications,
    markAsRead,
    markAllAsRead
  } = useNotifications(user?.id || null)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Notifikasi</h1>
        <p className="text-muted-foreground">Kelola notifikasi dan komunikasi</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Notification Center */}
        <div className="lg:col-span-2">
          <NotificationCenter
            notifications={notifications}
            onMarkAsRead={markAsRead}
            onMarkAllAsRead={markAllAsRead}
          />
        </div>

        {/* Quick Contact */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Kontak Cepat
              </CardTitle>
              <CardDescription>
                Hubungi admin atau orangtua
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Admin Bimbel</p>
                <div className="flex gap-2">
                  <WhatsAppButton
                    phone={ADMIN_CONTACT.phone}
                    message="Halo Admin, saya ingin bertanya tentang..."
                    className="flex-1"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp
                  </WhatsAppButton>
                  <EmailButton
                    email={ADMIN_CONTACT.email}
                    subject="Pertanyaan dari Aplikasi Bimbel"
                    className="flex-1"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </EmailButton>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-2">
                  Informasi Kontak Admin
                </p>
                <div className="space-y-1 text-sm">
                  <p><span className="text-muted-foreground">Nama:</span> {ADMIN_CONTACT.name}</p>
                  <p><span className="text-muted-foreground">Telepon:</span> {ADMIN_CONTACT.phone}</p>
                  <p><span className="text-muted-foreground">Email:</span> {ADMIN_CONTACT.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Pengaturan Notifikasi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Notifikasi Absensi</p>
                    <p className="text-xs text-muted-foreground">Pemberitahuan saat absensi</p>
                  </div>
                  <Button variant="outline" size="sm">Aktif</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Notifikasi Evaluasi</p>
                    <p className="text-xs text-muted-foreground">Pemberitahuan saat ada evaluasi baru</p>
                  </div>
                  <Button variant="outline" size="sm">Aktif</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Pengingat Jadwal</p>
                    <p className="text-xs text-muted-foreground">Pengingat sebelum kelas dimulai</p>
                  </div>
                  <Button variant="outline" size="sm">Aktif</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
