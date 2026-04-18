'use client'

import { cn } from '@/lib/utils'

interface PageLoadingProps {
  message?: string
  className?: string
}

export function PageLoading({ message = 'Memuat...', className }: PageLoadingProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center min-h-[400px] gap-4', className)}>
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-primary/20" />
        <div className="absolute inset-0 w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
      <p className="text-muted-foreground animate-pulse">{message}</p>
    </div>
  )
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-lg border bg-card p-4 space-y-3', className)}>
      <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
      <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
      <div className="h-8 bg-muted rounded animate-pulse w-full" />
    </div>
  )
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      <div className="h-10 bg-muted rounded animate-pulse" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-14 bg-muted/50 rounded animate-pulse" />
      ))}
    </div>
  )
}
