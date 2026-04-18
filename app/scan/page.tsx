'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { QRScanner } from '@/components/attendance/qr-scanner'
import { LocationVerifier } from '@/components/attendance/location-verifier'
import { WhatsAppButton } from '@/components/notifications/whatsapp-button'
import {
  GraduationCap,
  CheckCircle2,
  XCircle,
  MapPin,
  Clock,
  ArrowLeft,
  Home,
  Send
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { useGeolocation, verifyBimbelLocation } from '@/hooks/use-geolocation'
import {
  getSessionById,
  getClassById,
  addAttendanceRecord,
  generateId,
  getStudentById
} from '@/lib/store'
import { DEFAULT_LOCATION, WA_TEMPLATES, ADMIN_CONTACT } from '@/lib/constants'
import type { QRCodeData, AttendanceRecord } from '@/lib/types'
import { format } from 'date-fns'
import { id as localeId } from 'date-fns/locale'
import { toast } from 'sonner'
import { Toaster } from '@/components/ui/sonner'

type ScanStep = 'scan' | 'location' | 'success' | 'error'

export default function ScanPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()
  const { getPosition } = useGeolocation()
  const [step, setStep] = useState<ScanStep>('scan')
  const [scannedData, setScannedData] = useState<QRCodeData | null>(null)
  const [attendanceRecord, setAttendanceRecord] = useState<AttendanceRecord | null>(null)
  const [className, setClassName] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/')
    }
  }, [isLoading, isAuthenticated, router])

  const handleScan = async (data: QRCodeData) => {
    setScannedData(data)
    
    // Get session and class info
    const session = getSessionById(data.sessionId)
    if (!session) {
      setError('Sesi tidak ditemukan')
      setStep('error')
      return
    }

    const cls = getClassById(session.classId)
    if (cls) {
      setClassName(cls.name)
    }

    // Move to location verification
    setStep('location')
  }

  const handleLocationVerified = async (verified: boolean, distance: number) => {
    if (!scannedData || !user) return

    // Determine attendance status
    const now = new Date()
    const session = getSessionById(scannedData.sessionId)
    let status: AttendanceRecord['status'] = 'present'

    if (session) {
      const [hours, minutes] = session.startTime.split(':').map(Number)
      const sessionStart = new Date()
      sessionStart.setHours(hours, minutes, 0, 0)

      // If more than 15 minutes late
      if (now.getTime() - sessionStart.getTime() > 15 * 60 * 1000) {
        status = 'late'
      }
    }

    // Get current position
    const position = await getPosition()

    // Create attendance record
    const record: AttendanceRecord = {
      id: generateId(),
      sessionId: scannedData.sessionId,
      studentId: user.id,
      status,
      checkInTime: format(now, 'HH:mm'),
      location: position ? {
        latitude: position.latitude,
        longitude: position.longitude,
        accuracy: position.accuracy
      } : undefined,
      verifiedLocation: verified,
      createdAt: now.toISOString()
    }

    addAttendanceRecord(record)
    setAttendanceRecord(record)
    setStep('success')
    toast.success('Absensi berhasil!')
  }

  const handleScanError = (errorMsg: string) => {
    setError(errorMsg)
  }

  if (isLoading) {
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
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur border-b">
        <div className="max-w-lg mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Kembali</span>
          </Link>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-primary" />
            <span className="font-semibold">Scan Absensi</span>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* User Info */}
        {user && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">
                    {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-muted-foreground capitalize">{user.role}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step: Scan QR */}
        {step === 'scan' && (
          <QRScanner onScan={handleScan} onError={handleScanError} />
        )}

        {/* Step: Location Verification */}
        {step === 'location' && (
          <div className="space-y-4">
            {className && (
              <Alert>
                <CheckCircle2 className="w-4 h-4" />
                <AlertTitle>QR Code Valid</AlertTitle>
                <AlertDescription>
                  Kelas: <strong>{className}</strong>
                </AlertDescription>
              </Alert>
            )}
            
            <LocationVerifier
              targetLocation={DEFAULT_LOCATION}
              onVerified={handleLocationVerified}
            />

            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleLocationVerified(false, 0)}
            >
              Lewati Verifikasi Lokasi
            </Button>
          </div>
        )}

        {/* Step: Success */}
        {step === 'success' && attendanceRecord && (
          <Card className="border-emerald-200 bg-emerald-50">
            <CardHeader className="text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>
              <CardTitle className="text-emerald-800">Absensi Berhasil!</CardTitle>
              <CardDescription className="text-emerald-600">
                Kehadiran Anda telah tercatat
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Kelas</span>
                  <span className="font-medium">{className}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Waktu Check-in</span>
                  <span className="font-medium">{attendanceRecord.checkInTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge variant={attendanceRecord.status === 'present' ? 'default' : 'secondary'}>
                    {attendanceRecord.status === 'present' ? 'Hadir' : 'Terlambat'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Lokasi</span>
                  <Badge variant="outline">
                    <MapPin className="w-3 h-3 mr-1" />
                    {attendanceRecord.verifiedLocation ? 'Terverifikasi' : 'Tidak diverifikasi'}
                  </Badge>
                </div>
              </div>

              <div className="flex gap-2">
                <WhatsAppButton
                  phone={ADMIN_CONTACT.phone}
                  message={WA_TEMPLATES.attendanceConfirm(
                    user?.name || '',
                    className,
                    format(new Date(), 'HH:mm, d MMMM yyyy', { locale: localeId })
                  )}
                  variant="outline"
                  className="flex-1"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Kirim Konfirmasi
                </WhatsAppButton>
              </div>

              <Button asChild className="w-full">
                <Link href="/dashboard">
                  <Home className="w-4 h-4 mr-2" />
                  Kembali ke Dashboard
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step: Error */}
        {step === 'error' && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader className="text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-red-800">Absensi Gagal</CardTitle>
              <CardDescription className="text-red-600">
                {error || 'Terjadi kesalahan saat melakukan absensi'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={() => {
                  setStep('scan')
                  setError('')
                  setScannedData(null)
                }}
                className="w-full"
              >
                Coba Lagi
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href="/dashboard">
                  Kembali ke Dashboard
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        {step === 'scan' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Cara Absensi</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center shrink-0">1</span>
                  <span>Minta tutor untuk menampilkan QR Code absensi</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center shrink-0">2</span>
                  <span>Klik tombol &quot;Mulai Scan&quot; dan arahkan kamera ke QR Code</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center shrink-0">3</span>
                  <span>Verifikasi lokasi Anda (opsional)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center shrink-0">4</span>
                  <span>Absensi selesai! Anda bisa mengirim konfirmasi ke orangtua</span>
                </li>
              </ol>
            </CardContent>
          </Card>
        )}
      </main>

      <Toaster position="top-center" />
    </div>
  )
}
