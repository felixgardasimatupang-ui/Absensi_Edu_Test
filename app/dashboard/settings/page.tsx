'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Settings,
  User,
  Bell,
  MapPin,
  Shield,
  Palette,
  Save,
  RefreshCw
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { DEFAULT_LOCATION, ADMIN_CONTACT } from '@/lib/constants'
import { toast } from 'sonner'

export default function SettingsPage() {
  const { user, updateUser } = useAuth()
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [phone, setPhone] = useState(user?.phone || '')

  const handleSaveProfile = () => {
    if (user) {
      updateUser({ name, email, phone })
      toast.success('Profil berhasil diperbarui!')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Pengaturan</h1>
        <p className="text-muted-foreground">Kelola akun dan preferensi Anda</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Settings */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profil
              </CardTitle>
              <CardDescription>
                Informasi akun Anda
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20">
                  <AvatarFallback className="bg-primary/10 text-primary text-xl">
                    {user?.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user?.name}</p>
                  <p className="text-sm text-muted-foreground capitalize">{user?.role}</p>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Lengkap</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">No. Telepon</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <Button onClick={handleSaveProfile}>
                <Save className="w-4 h-4 mr-2" />
                Simpan Perubahan
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notifikasi
              </CardTitle>
              <CardDescription>
                Atur preferensi notifikasi
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Notifikasi Email</p>
                  <p className="text-sm text-muted-foreground">Terima pemberitahuan via email</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Notifikasi WhatsApp</p>
                  <p className="text-sm text-muted-foreground">Terima pemberitahuan via WhatsApp</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Pengingat Jadwal</p>
                  <p className="text-sm text-muted-foreground">Ingatkan sebelum kelas dimulai</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Laporan Mingguan</p>
                  <p className="text-sm text-muted-foreground">Terima ringkasan kehadiran mingguan</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Lokasi Bimbel
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-medium">{DEFAULT_LOCATION.name}</p>
                <p className="text-sm text-muted-foreground">{DEFAULT_LOCATION.address}</p>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>Radius absensi: {DEFAULT_LOCATION.radius} meter</p>
                <p>Koordinat: {DEFAULT_LOCATION.latitude}, {DEFAULT_LOCATION.longitude}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Kontak Admin
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p><span className="text-muted-foreground">Nama:</span> {ADMIN_CONTACT.name}</p>
              <p><span className="text-muted-foreground">Telepon:</span> {ADMIN_CONTACT.phone}</p>
              <p><span className="text-muted-foreground">Email:</span> {ADMIN_CONTACT.email}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5" />
                Data Demo
              </CardTitle>
              <CardDescription>
                Mode demo dengan localStorage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Aplikasi ini berjalan dalam mode demo. Data disimpan di browser dan akan hilang jika cache dibersihkan.
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  localStorage.clear()
                  window.location.reload()
                }}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset Data Demo
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
