import { useState, useCallback } from 'react'
import { BarChart3, FileText } from 'lucide-react'
import { httpGet } from '../services/httpClient'
import api from '../api/endpoints'
import { KpiCard } from '../components/ui/KpiCard'
import { Card } from '../components/ui/Card'
import { FilterBar } from '../components/ui/FilterBar'
import { EmptyState } from '../components/ui/EmptyState'
import { SkeletonKpi } from '../components/ui/Skeleton'

export default function Indicadores() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    data_inicio: '',
    data_fim: '',
    database: '',
  })

  const handleFilterChange = useCallback((id, value) => {
    setFilters((prev) => ({ ...prev, [id]: value }))
  }, [])

  const handleReset = useCallback(() => {
    setFilters({ data_inicio: '', data_fim: '', database: '' })
    setData(null)
  }, [])

  const handleApply = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = {}
      if (filters.data_inicio) params.data_inicio = filters.data_inicio
      if (filters.data_fim) params.data_fim = filters.data_fim
      if (filters.database) params.database = filters.database

      const qs = new URLSearchParams(params).toString()
      const url = qs ? `${api.indicadoresExecutivos}?${qs}` : api.indicadoresExecutivos
      const result = await httpGet(url)
      setData(result)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [filters])

  const filterConfig = [
    { id: 'data_inicio', label: 'Data Início', type: 'date', value: filters.data_inicio },
    { id: 'data_fim', label: 'Data Fim', type: 'date', value: filters.data_fim },
    {
      id: 'database',
      label: 'Base de Dados',
      type: 'select',
      value: filters.database,
      options: [
        { value: '', label: 'Padrão' },
        { value: 'azportoex', label: 'MATRIZ (azportoex)' },
        { value: 'portoexsp', label: 'FILIAL (portoexsp)' },
      ],
    },
  ]

  // Backend retorna panel_data (objeto) ou indicadores/kpis (array). Normaliza para array de { label, value }.
  const rawIndicadores = data?.indicadores ?? data?.kpis
  const panelData = data?.panel_data
  const indicadores = Array.isArray(rawIndicadores)
    ? rawIndicadores
    : panelData && typeof panelData === 'object'
      ? Object.entries(panelData)
          .filter(([, v]) => v != null && typeof v !== 'object')
          .map(([key, value]) => ({
            label: key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
            value: typeof value === 'number' ? value.toLocaleString('pt-BR') : String(value),
          }))
      : []
  const leituraExecutiva = data?.leitura_executiva || data?.resumo || null

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Indicadores Executivos</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          KPIs e métricas de performance da operação
        </p>
      </div>

      {/* Filters */}
      <FilterBar
        filters={filterConfig}
        onChange={handleFilterChange}
        onReset={handleReset}
        onApply={handleApply}
      />

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => <SkeletonKpi key={i} />)}
        </div>
      )}

      {/* Error */}
      {error && (
        <Card className="border-destructive/20 bg-destructive/5">
          <p className="text-sm text-destructive">{error}</p>
        </Card>
      )}

      {/* Executive Reading */}
      {leituraExecutiva && (
        <Card className="border-primary/20 bg-primary/5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <FileText size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Leitura Executiva</h3>
              <p className="mt-1 text-sm text-muted-foreground whitespace-pre-line">
                {leituraExecutiva}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* KPIs */}
      {!loading && indicadores.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {indicadores.map((kpi, idx) => (
            <div key={idx} className="stagger-child">
              <KpiCard
                label={kpi.label || kpi.nome || `KPI ${idx + 1}`}
                value={kpi.value ?? kpi.valor ?? '—'}
                trend={kpi.trend || kpi.tendencia}
                trendLabel={kpi.trend_label || kpi.variacao}
              />
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && !data && (
        <EmptyState
          icon={BarChart3}
          title="Selecione os filtros"
          description="Aplique os filtros acima para carregar os indicadores executivos."
          action="Carregar indicadores"
          onAction={handleApply}
        />
      )}
    </div>
  )
}
