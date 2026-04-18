'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  GraduationCap,
  QrCode,
  MapPin,
  Star,
  Bell,
  Users,
  CheckCircle2,
  ArrowRight,
  Loader2
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { DEMO_CREDENTIALS } from '@/lib/mock-data'
import { initializeStore } from '@/lib/store'

const features = [
  {
    icon: QrCode,
    title: 'Absensi QR Code',
    description: 'Scan QR Code untuk absensi cepat dan akurat'
  },
  {
    icon: MapPin,
    title: 'Verifikasi Lokasi',
    description: 'Pastikan siswa hadir di lokasi dengan GPS'
  },
  {
    icon: Star,
    title: 'Evaluasi Lengkap',
    description: 'Rating bintang dan rubrik penilaian detail'
  },
  {
    icon: Bell,
    title: 'Notifikasi Real-time',
    description: 'WhatsApp, Email, dan In-App notification'
  }
]

export default function HomePage() {
  const router = useRouter()
  const { login, isAuthenticated, isLoading: authLoading } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    initializeStore()
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const result = await login(email, password)
    
    if (result.success) {
      router.push('/dashboard')
    } else {
      setError(result.error || 'Terjadi kesalahan')
    }
    
    setIsLoading(false)
  }

  const handleDemoLogin = async (role: keyof typeof DEMO_CREDENTIALS) => {
    setIsLoading(true)
    setError('')
    
    const creds = DEMO_CREDENTIALS[role]
    const result = await login(creds.email, creds.password)
    
    if (result.success) {
      router.push('/dashboard')
    } else {
      setError(result.error || 'Terjadi kesalahan')
    }
    
    setIsLoading(false)
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-muted-foreground">Memuat...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pt-12 pb-20 lg:pt-20 lg:pb-28">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
              {/* Left side - Hero content */}
              <div className="space-y-8">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <span className="font-semibold text-lg">Bimbel Cerdas</span>
                </div>
                
                <div className="space-y-4">
                  <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-balance">
                    Sistem Absensi & Evaluasi{' '}
                    <span className="text-primary">Modern</span>
                  </h1>
                  <p className="text-lg text-muted-foreground max-w-lg text-pretty">
                    Kelola absensi dengan QR Code, verifikasi lokasi GPS, dan evaluasi siswa secara komprehensif. Terhubung langsung dengan orang tua melalui WhatsApp dan Email.
                  </p>
                </div>

                {/* Features list */}
                <div className="grid gap-4 sm:grid-cols-2">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <feature.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right side - Login card */}
              <div className="lg:pl-8">
                <Card className="w-full max-w-md mx-auto shadow-lg">
                  <CardHeader className="text-center">
                    <CardTitle>Masuk ke Akun</CardTitle>
                    <CardDescription>
                      Gunakan akun demo atau masuk dengan akun Anda
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="demo" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="demo">Demo</TabsTrigger>
                        <TabsTrigger value="login">Login</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="demo" className="space-y-4 mt-4">
                        <p className="text-sm text-muted-foreground text-center">
                          Pilih role untuk masuk dengan akun demo
                        </p>
                        <div className="grid gap-2">
                          <Button
                            variant="outline"
                            className="justify-start h-auto py-3"
                            onClick={() => handleDemoLogin('admin')}
                            disabled={isLoading}
                          >
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mr-3">
                              <Users className="w-5 h-5 text-primary" />
                            </div>
                            <div className="text-left">
                              <p className="font-medium">Admin</p>
                              <p className="text-xs text-muted-foreground">Akses penuh ke semua fitur</p>
                            </div>
                            <ArrowRight className="w-4 h-4 ml-auto" />
                          </Button>
                          
                          <Button
                            variant="outline"
                            className="justify-start h-auto py-3"
                            onClick={() => handleDemoLogin('tutor')}
                            disabled={isLoading}
                          >
                            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center mr-3">
                              <GraduationCap className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div className="text-left">
                              <p className="font-medium">Tutor</p>
                              <p className="text-xs text-muted-foreground">Kelola kelas dan evaluasi</p>
                            </div>
                            <ArrowRight className="w-4 h-4 ml-auto" />
                          </Button>
                          
                          <Button
                            variant="outline"
                            className="justify-start h-auto py-3"
                            onClick={() => handleDemoLogin('student')}
                            disabled={isLoading}
                          >
                            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center mr-3">
                              <QrCode className="w-5 h-5 text-amber-600" />
                            </div>
                            <div className="text-left">
                              <p className="font-medium">Siswa</p>
                              <p className="text-xs text-muted-foreground">Scan absensi dan lihat evaluasi</p>
                            </div>
                            <ArrowRight className="w-4 h-4 ml-auto" />
                          </Button>
                          
                          <Button
                            variant="outline"
                            className="justify-start h-auto py-3"
                            onClick={() => handleDemoLogin('parent')}
                            disabled={isLoading}
                          >
                            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center mr-3">
                              <Bell className="w-5 h-5 text-purple-600" />
                            </div>
                            <div className="text-left">
                              <p className="font-medium">Orang Tua</p>
                              <p className="text-xs text-muted-foreground">Pantau kehadiran dan progress</p>
                            </div>
                            <ArrowRight className="w-4 h-4 ml-auto" />
                          </Button>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="login" className="space-y-4 mt-4">
                        <form onSubmit={handleLogin} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder="nama@email.com"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                              id="password"
                              type="password"
                              placeholder="********"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              required
                            />
                          </div>
                          
                          {error && (
                            <Alert variant="destructive">
                              <AlertDescription>{error}</AlertDescription>
                            </Alert>
                          )}
                          
                          <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Memproses...
                              </>
                            ) : (
                              'Masuk'
                            )}
                          </Button>
                        </form>
                        
                        <div className="text-center text-sm text-muted-foreground">
                          <p>Demo credentials:</p>
                          <p className="font-mono text-xs">admin@bimbel.id / admin123</p>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-primary" />
              <span className="font-medium">Bimbel Cerdas Indonesia</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Sistem Absensi & Evaluasi - Demo Mode
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
