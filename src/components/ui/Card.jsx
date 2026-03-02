import { cn } from '../../lib/utils'

export function Card({ children, className, hover = false, ...props }) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-card p-5 shadow-card transition-all duration-200',
        hover && 'cursor-pointer hover:shadow-card-hover hover:-translate-y-0.5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className }) {
  return <div className={cn('mb-3', className)}>{children}</div>
}

export function CardTitle({ children, className }) {
  return <h3 className={cn('text-sm font-semibold text-foreground', className)}>{children}</h3>
}

export function CardDescription({ children, className }) {
  return <p className={cn('text-xs text-muted-foreground mt-0.5', className)}>{children}</p>
}

export function CardContent({ children, className }) {
  return <div className={cn('', className)}>{children}</div>
}
