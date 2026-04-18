'use client'

import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon?: React.ReactNode
  trend?: {
    value: number
    label: string
  }
  className?: string
}

export function StatCard({ title, value, description, icon, trend, className }: StatCardProps) {
  const getTrendIcon = () => {
    if (!trend) return null
    if (trend.value > 0) return <TrendingUp className="w-3 h-3" />
    if (trend.value < 0) return <TrendingDown className="w-3 h-3" />
    return <Minus className="w-3 h-3" />
  }

  const getTrendColor = () => {
    if (!trend) return ''
    if (trend.value > 0) return 'text-emerald-600'
    if (trend.value < 0) return 'text-red-600'
    return 'text-muted-foreground'
  }

  return (
    <Card className={cn('', className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
            {trend && (
              <div className={cn('flex items-center gap-1 text-xs', getTrendColor())}>
                {getTrendIcon()}
                <span>{Math.abs(trend.value)}%</span>
                <span className="text-muted-foreground">{trend.label}</span>
              </div>
            )}
          </div>
          {icon && (
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

interface MiniStatProps {
  label: string
  value: string | number
  color?: 'default' | 'success' | 'warning' | 'destructive'
}

export function MiniStat({ label, value, color = 'default' }: MiniStatProps) {
  const colorClasses = {
    default: 'bg-muted text-foreground',
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    destructive: 'bg-red-100 text-red-700'
  }

  return (
    <div className={cn('px-3 py-2 rounded-lg', colorClasses[color])}>
      <p className="text-xs opacity-80">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  )
}
