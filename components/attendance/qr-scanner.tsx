'use client'

import { useState, useEffect, useRef } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Camera, CameraOff, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react'
import type { QRCodeData } from '@/lib/types'

interface QRScannerProps {
  onScan: (data: QRCodeData) => void
  onError?: (error: string) => void
}

type ScanStatus = 'idle' | 'scanning' | 'success' | 'error' | 'expired'

export function QRScanner({ onScan, onError }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [status, setStatus] = useState<ScanStatus>('idle')
  const [message, setMessage] = useState<string>('')
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const startScanner = async () => {
    if (!containerRef.current) return

    try {
      // Request camera permission first
      await navigator.mediaDevices.getUserMedia({ video: true })
      setHasPermission(true)

      const scanner = new Html5Qrcode('qr-reader')
      scannerRef.current = scanner

      await scanner.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 }
        },
        (decodedText) => {
          handleScan(decodedText)
        },
        () => {
          // Ignore errors during scanning
        }
      )

      setIsScanning(true)
      setStatus('scanning')
      setMessage('Arahkan kamera ke QR Code')
    } catch (err) {
      console.error('Camera error:', err)
      setHasPermission(false)
      setStatus('error')
      setMessage('Tidak dapat mengakses kamera. Pastikan izin kamera diberikan.')
      onError?.('Tidak dapat mengakses kamera')
    }
  }

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop()
        scannerRef.current = null
      } catch (err) {
        console.error('Error stopping scanner:', err)
      }
    }
    setIsScanning(false)
    setStatus('idle')
  }

  const handleScan = (decodedText: string) => {
    try {
      const data: QRCodeData = JSON.parse(decodedText)
      
      // Validate QR data structure
      if (!data.sessionId || !data.classId || !data.expiry) {
        throw new Error('QR Code tidak valid')
      }

      // Check if QR is expired
      if (Date.now() > data.expiry) {
        setStatus('expired')
        setMessage('QR Code sudah kadaluarsa. Minta tutor untuk generate QR baru.')
        onError?.('QR Code sudah kadaluarsa')
        stopScanner()
        return
      }

      // Success
      setStatus('success')
      setMessage('QR Code berhasil dipindai!')
      stopScanner()
      onScan(data)
    } catch {
      setStatus('error')
      setMessage('QR Code tidak valid atau rusak')
      onError?.('QR Code tidak valid')
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {})
      }
    }
  }, [])

  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="w-12 h-12 text-emerald-500" />
      case 'error':
        return <XCircle className="w-12 h-12 text-destructive" />
      case 'expired':
        return <AlertTriangle className="w-12 h-12 text-amber-500" />
      default:
        return null
    }
  }

  const getStatusAlert = () => {
    if (status === 'idle' || status === 'scanning') return null

    const variant = status === 'success' ? 'default' : 'destructive'
    
    return (
      <Alert variant={variant} className="mt-4">
        <AlertDescription className="flex items-center gap-2">
          {getStatusIcon()}
          <span>{message}</span>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Camera className="w-4 h-4 text-primary" />
          </div>
          Scan QR Absensi
        </CardTitle>
        <CardDescription>
          Scan QR Code dari tutor untuk melakukan absensi
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div 
          ref={containerRef}
          className="relative w-full aspect-square bg-muted rounded-lg overflow-hidden"
        >
          <div id="qr-reader" className="w-full h-full" />
          
          {!isScanning && status !== 'success' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-muted">
              {hasPermission === false ? (
                <>
                  <CameraOff className="w-12 h-12 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground text-center px-4">
                    Izin kamera diperlukan untuk scan QR Code
                  </p>
                </>
              ) : (
                <>
                  <Camera className="w-12 h-12 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Klik tombol di bawah untuk mulai scan
                  </p>
                </>
              )}
            </div>
          )}

          {status === 'success' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-emerald-50">
              <CheckCircle2 className="w-16 h-16 text-emerald-500" />
              <p className="text-lg font-medium text-emerald-700">Berhasil!</p>
            </div>
          )}
        </div>

        {getStatusAlert()}

        <div className="flex gap-2">
          {!isScanning ? (
            <Button onClick={startScanner} className="w-full" disabled={status === 'success'}>
              <Camera className="w-4 h-4 mr-2" />
              {status === 'success' ? 'Scan Selesai' : 'Mulai Scan'}
            </Button>
          ) : (
            <Button onClick={stopScanner} variant="outline" className="w-full">
              <CameraOff className="w-4 h-4 mr-2" />
              Berhenti Scan
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
