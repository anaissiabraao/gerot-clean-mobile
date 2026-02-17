import { InboxIcon } from 'lucide-react'
import { Button } from './Button'

export function EmptyState({
  icon = InboxIcon,
  title = 'Nenhum dado encontrado',
  description = 'Não há informações para exibir no momento.',
  action,
  onAction,
}) {
  const Icon = icon

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
        {Icon ? <Icon size={28} className="text-muted-foreground" /> : null}
      </div>
      <h3 className="mb-1 text-base font-semibold text-foreground">{title}</h3>
      <p className="mb-6 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action && (
        <Button variant="outline" onClick={onAction}>
          {action}
        </Button>
      )}
    </div>
  )
}
