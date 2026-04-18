'use client'

import { useState, useCallback } from 'react'
import { GEO_OPTIONS, DEFAULT_LOCATION } from '@/lib/constants'

interface GeoPosition {
  latitude: number
  longitude: number
  accuracy: number
}

interface UseGeolocationReturn {
  position: GeoPosition | null
  error: string | null
  isLoading: boolean
  getPosition: () => Promise<GeoPosition | null>
  checkWithinRadius: (targetLat: number, targetLng: number, radius: number) => boolean
  distanceFromTarget: (targetLat: number, targetLng: number) => number | null
}

// Haversine formula to calculate distance between two coordinates
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3 // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180
  const φ2 = (lat2 * Math.PI) / 180
  const Δφ = ((lat2 - lat1) * Math.PI) / 180
  const Δλ = ((lon2 - lon1) * Math.PI) / 180

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c // Distance in meters
}

export function useGeolocation(): UseGeolocationReturn {
  const [position, setPosition] = useState<GeoPosition | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const getPosition = useCallback(async (): Promise<GeoPosition | null> => {
    if (!navigator.geolocation) {
      setError('Geolocation tidak didukung oleh browser Anda')
      return null
    }

    setIsLoading(true)
    setError(null)

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newPosition: GeoPosition = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy: pos.coords.accuracy
          }
          setPosition(newPosition)
          setIsLoading(false)
          resolve(newPosition)
        },
        (err) => {
          let errorMessage: string
          switch (err.code) {
            case err.PERMISSION_DENIED:
              errorMessage = 'Izin lokasi ditolak. Silakan aktifkan izin lokasi di pengaturan browser.'
              break
            case err.POSITION_UNAVAILABLE:
              errorMessage = 'Informasi lokasi tidak tersedia.'
              break
            case err.TIMEOUT:
              errorMessage = 'Waktu permintaan lokasi habis.'
              break
            default:
              errorMessage = 'Terjadi kesalahan saat mengambil lokasi.'
          }
          setError(errorMessage)
          setIsLoading(false)
          resolve(null)
        },
        GEO_OPTIONS
      )
    })
  }, [])

  const checkWithinRadius = useCallback(
    (targetLat: number, targetLng: number, radius: number): boolean => {
      if (!position) return false
      const distance = calculateDistance(
        position.latitude,
        position.longitude,
        targetLat,
        targetLng
      )
      return distance <= radius
    },
    [position]
  )

  const distanceFromTarget = useCallback(
    (targetLat: number, targetLng: number): number | null => {
      if (!position) return null
      return calculateDistance(
        position.latitude,
        position.longitude,
        targetLat,
        targetLng
      )
    },
    [position]
  )

  return {
    position,
    error,
    isLoading,
    getPosition,
    checkWithinRadius,
    distanceFromTarget
  }
}

// Helper to verify location against default bimbel location
export function verifyBimbelLocation(
  userLat: number,
  userLng: number,
  radius: number = DEFAULT_LOCATION.radius
): { isWithin: boolean; distance: number } {
  const distance = calculateDistance(
    userLat,
    userLng,
    DEFAULT_LOCATION.latitude,
    DEFAULT_LOCATION.longitude
  )
  return {
    isWithin: distance <= radius,
    distance: Math.round(distance)
  }
}
