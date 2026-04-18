'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { MapPin, Navigation, CheckCircle2, XCircle, Loader2, ExternalLink } from 'lucide-react'
import { useGeolocation, verifyBimbelLocation } from '@/hooks/use-geolocation'
import { DEFAULT_LOCATION } from '@/lib/constants'
import type { Location } from '@/lib/types'

interface LocationVerifierProps {
  targetLocation?: Location
  onVerified?: (verified: boolean, distance: number) => void
  required?: boolean
}

export function LocationVerifier({ 
  targetLocation = DEFAULT_LOCATION, 
  onVerified,
  required = true 
}: LocationVerifierProps) {
  const { position, error, isLoading, getPosition } = useGeolocation()
  const [verification, setVerification] = useState<{
    isWithin: boolean
    distance: number
  } | null>(null)

  useEffect(() => {
    if (position) {
      const result = verifyBimbelLocation(
        position.latitude,
        position.longitude,
        targetLocation.radius
      )
      setVerification(result)
      onVerified?.(result.isWithin, result.distance)
    }
  }, [position, targetLocation, onVerified])

  const handleVerify = async () => {
    await getPosition()
  }

  const openInMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${targetLocation.latitude},${targetLocation.longitude}`
    window.open(url, '_blank')
  }

  const getStatusBadge = () => {
    if (!verification) return null

    if (verification.isWithin) {
      return (
        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Lokasi Terverifikasi
        </Badge>
      )
    }

    return (
      <Badge variant="destructive">
        <XCircle className="w-3 h-3 mr-1" />
        Di Luar Jangkauan
      </Badge>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-primary" />
              </div>
              Verifikasi Lokasi
            </CardTitle>
            <CardDescription className="mt-1">
              {required ? 'Diperlukan untuk absensi' : 'Opsional'}
            </CardDescription>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Target Location Info */}
        <div className="p-4 bg-muted rounded-lg space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Navigation className="w-4 h-4 text-primary" />
            {targetLocation.name}
          </div>
          <p className="text-sm text-muted-foreground">{targetLocation.address}</p>
          <p className="text-xs text-muted-foreground">
            Radius: {targetLocation.radius} meter
          </p>
        </div>

        {/* Map Preview (Static) */}
        <div className="relative w-full h-48 bg-muted rounded-lg overflow-hidden">
          <iframe
            src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.2!2d${targetLocation.longitude}!3d${targetLocation.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTInMzEuNyJTIDEwNsKwNTAnNDQuMiJF!5e0!3m2!1sen!2sid!4v1`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0"
          />
          <div className="absolute bottom-2 right-2">
            <Button size="sm" variant="secondary" onClick={openInMaps}>
              <ExternalLink className="w-3 h-3 mr-1" />
              Buka Maps
            </Button>
          </div>
        </div>

        {/* Verification Result */}
        {verification && (
          <Alert variant={verification.isWithin ? 'default' : 'destructive'}>
            <AlertDescription>
              <div className="flex items-center justify-between">
                <span>
                  {verification.isWithin
                    ? 'Anda berada dalam radius lokasi bimbel'
                    : 'Anda berada di luar radius lokasi bimbel'}
                </span>
                <Badge variant="outline">{verification.distance} m</Badge>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Error Message */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Position Info */}
        {position && (
          <div className="text-xs text-muted-foreground">
            <p>Lat: {position.latitude.toFixed(6)}, Lng: {position.longitude.toFixed(6)}</p>
            <p>Akurasi: {position.accuracy.toFixed(0)} meter</p>
          </div>
        )}

        {/* Verify Button */}
        <Button 
          onClick={handleVerify} 
          disabled={isLoading}
          className="w-full"
          variant={verification?.isWithin ? 'outline' : 'default'}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Mengambil Lokasi...
            </>
          ) : (
            <>
              <Navigation className="w-4 h-4 mr-2" />
              {verification ? 'Verifikasi Ulang' : 'Verifikasi Lokasi'}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
