'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingInputProps {
  value: number
  onChange: (value: number) => void
  max?: number
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  label?: string
  description?: string
}

export function StarRatingInput({
  value,
  onChange,
  max = 5,
  size = 'md',
  disabled = false,
  label,
  description
}: StarRatingInputProps) {
  const [hovered, setHovered] = useState<number>(0)

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  return (
    <div className="space-y-1">
      {label && (
        <label className="text-sm font-medium">{label}</label>
      )}
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      <div className="flex items-center gap-1">
        {Array.from({ length: max }, (_, i) => i + 1).map((star) => (
          <button
            key={star}
            type="button"
            disabled={disabled}
            onClick={() => !disabled && onChange(star)}
            onMouseEnter={() => !disabled && setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className={cn(
              'transition-transform hover:scale-110',
              disabled && 'cursor-not-allowed opacity-50'
            )}
          >
            <Star
              className={cn(
                sizeClasses[size],
                'transition-colors',
                (hovered || value) >= star
                  ? 'fill-amber-400 text-amber-400'
                  : 'fill-transparent text-muted-foreground'
              )}
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-muted-foreground">
          {value}/{max}
        </span>
      </div>
    </div>
  )
}

interface StarRatingDisplayProps {
  value: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
}

export function StarRatingDisplay({
  value,
  max = 5,
  size = 'sm',
  showValue = true
}: StarRatingDisplayProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }, (_, i) => i + 1).map((star) => (
        <Star
          key={star}
          className={cn(
            sizeClasses[size],
            value >= star
              ? 'fill-amber-400 text-amber-400'
              : value >= star - 0.5
              ? 'fill-amber-400/50 text-amber-400'
              : 'fill-transparent text-muted-foreground/30'
          )}
        />
      ))}
      {showValue && (
        <span className="ml-1.5 text-sm font-medium">{value.toFixed(1)}</span>
      )}
    </div>
  )
}

// Utility to calculate average rating
export function calculateAverageRating(ratings: { keaktifan: number; pemahaman: number; sikap: number }): number {
  return Number(((ratings.keaktifan + ratings.pemahaman + ratings.sikap) / 3).toFixed(1))
}
