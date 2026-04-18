'use client'

import { useState, useCallback } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { RefreshCw, Download, Clock, MapPin } from 'lucide-react'
import type { Class, AttendanceSession, QRCodeData } from '@/lib/types'
import { QR_EXPIRY_MINUTES, QR_SIZE } from '@/lib/constants'
import { addSession, generateId } from '@/lib/store'

interface QRGeneratorProps {
  classes: Class[]
  tutorId: string
  onSessionCreated?: (session: AttendanceSession) => void
}

export function QRGenerator({ classes, tutorId, onSessionCreated }: QRGeneratorProps) {
  const [selectedClassId, setSelectedClassId] = useState<string>('')
  const [currentSession, setCurrentSession] = useState<AttendanceSession | null>(null)
  const [qrData, setQrData] = useState<string>('')
  const [expiryTime, setExpiryTime] = useState<Date | null>(null)
  const [timeLeft, setTimeLeft] = useState<number>(0)

  const selectedClass = classes.find(c => c.id === selectedClassId)

  const generateQR = useCallback(() => {
    if (!selectedClass) return

    const now = new Date()
    const expiry = new Date(now.getTime() + QR_EXPIRY_MINUTES * 60 * 1000)
    const sessionId = generateId()

    const qrCodeData: QRCodeData = {
      sessionId,
      classId: selectedClass.id,
      timestamp: now.getTime(),
      expiry: expiry.getTime(),
      signature: btoa(`${sessionId}-${selectedClass.id}-${now.getTime()}`)
    }

    const session: AttendanceSession = {
      id: sessionId,
      classId: selectedClass.id,
      tutorId,
      date: now.toISOString().split('T')[0],
      startTime: now.toTimeString().slice(0, 5),
      endTime: '',
      qrCode: JSON.stringify(qrCodeData),
      qrExpiry: expiry.toISOString(),
      status: 'active',
      createdAt: now.toISOString()
    }

    addSession(session)
    setCurrentSession(session)
    setQrData(JSON.stringify(qrCodeData))
    setExpiryTime(expiry)
    setTimeLeft(QR_EXPIRY_MINUTES * 60)
    onSessionCreated?.(session)

    // Start countdown
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [selectedClass, tutorId, onSessionCreated])

  const downloadQR = () => {
    const svg = document.getElementById('qr-code-svg')
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      canvas.width = QR_SIZE
      canvas.height = QR_SIZE
      ctx?.drawImage(img, 0, 0)
      const pngFile = canvas.toDataURL('image/png')
      const downloadLink = document.createElement('a')
      downloadLink.download = `QR-${selectedClass?.name}-${new Date().toISOString().split('T')[0]}.png`
      downloadLink.href = pngFile
      downloadLink.click()
    }
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
  }

  const formatTimeLeft = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <RefreshCw className="w-4 h-4 text-primary" />
          </div>
          Generate QR Absensi
        </CardTitle>
        <CardDescription>
          Pilih kelas dan generate QR Code untuk absensi siswa
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Pilih Kelas</label>
          <Select value={selectedClassId} onValueChange={setSelectedClassId}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih kelas..." />
            </SelectTrigger>
            <SelectContent>
              {classes.map(cls => (
                <SelectItem key={cls.id} value={cls.id}>
                  {cls.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedClass && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{selectedClass.location.name}</span>
          </div>
        )}

        <Button 
          onClick={generateQR} 
          disabled={!selectedClassId}
          className="w-full"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Generate QR Code
        </Button>

        {qrData && (
          <div className="space-y-4">
            <div className="flex flex-col items-center p-4 bg-white rounded-lg border">
              <QRCodeSVG
                id="qr-code-svg"
                value={qrData}
                size={QR_SIZE}
                level="H"
                includeMargin
                bgColor="#ffffff"
                fgColor="#0f766e"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Berlaku selama
                </span>
              </div>
              <Badge variant={timeLeft > 60 ? 'default' : 'destructive'}>
                {formatTimeLeft(timeLeft)}
              </Badge>
            </div>

            <Button 
              onClick={downloadQR} 
              variant="outline"
              className="w-full"
            >
              <Download className="w-4 h-4 mr-2" />
              Download QR Code
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
