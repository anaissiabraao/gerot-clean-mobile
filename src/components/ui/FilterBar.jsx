import { Button } from './Button'
import { Input, Select } from './Input'

export function FilterBar({ filters, onChange, onReset, onApply }) {
  return (
    <div className="flex flex-wrap items-end gap-3 rounded-xl border border-border bg-card p-4 shadow-card">
      {filters.map((filter) =>
        filter.type === 'select' ? (
          <Select
            key={filter.id}
            id={filter.id}
            label={filter.label}
            options={filter.options}
            value={filter.value}
            onChange={(e) => onChange(filter.id, e.target.value)}
          />
        ) : (
          <Input
            key={filter.id}
            id={filter.id}
            label={filter.label}
            type={filter.type || 'text'}
            value={filter.value}
            onChange={(e) => onChange(filter.id, e.target.value)}
          />
        )
      )}
      <div className="flex gap-2">
        {onApply && (
          <Button size="md" onClick={onApply}>
            Filtrar
          </Button>
        )}
        {onReset && (
          <Button variant="ghost" size="md" onClick={onReset}>
            Limpar
          </Button>
        )}
      </div>
    </div>
  )
}
