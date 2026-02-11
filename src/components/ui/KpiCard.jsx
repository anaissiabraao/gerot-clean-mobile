import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '../../lib/utils'

export function KpiCard({ label, value, trend, trendLabel, icon: Icon, className }) {
  const trendColor =
    trend === 'up'
      ? 'text-success'
      : trend === 'down'
      ? 'text-destructive'
      : 'text-muted-foreground'

  const TrendIcon =
    trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus

  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-card p-5 shadow-card transition-all duration-200 hover:shadow-card-hover',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        {Icon && (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Icon size={16} className="text-primary" />
          </div>
        )}
      </div>
      <div className="mt-2 text-2xl font-bold text-foreground">{value}</div>
      {(trend || trendLabel) && (
        <div className={cn('mt-1.5 flex items-center gap-1 text-xs font-medium', trendColor)}>
          <TrendIcon size={14} />
          <span>{trendLabel}</span>
        </div>
      )}
    </div>
  )
}
