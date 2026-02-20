import { useState, useEffect, useMemo, useCallback } from 'react'
import { ExternalLink, BarChart2, Monitor, Eye } from 'lucide-react'
import { httpGet } from '../services/httpClient'
import api from '../api/endpoints'
import env from '../config/env'
import { Card, CardTitle, CardDescription } from '../components/ui/Card'
import { KpiCard } from '../components/ui/KpiCard'
import { ChartCard } from '../components/ui/ChartCard'
import { FilterBar } from '../components/ui/FilterBar'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { EmptyState } from '../components/ui/EmptyState'
import { SkeletonCard, SkeletonKpi } from '../components/ui/Skeleton'

/** Converte asset_config.chart (template Chart.js) para formato do ChartCard: { type, title, labels, datasets } */
function assetToChartConfig(asset) {
  const ch = asset?.asset_config?.chart
  if (!ch || !Array.isArray(ch?.labels) || !Array.isArray(ch?.data)) return null
  return {
    id: `chart-${asset.id}`,
    type: ch.type || 'bar',
    title: asset.nome || 'Gráfico',
    labels: ch.labels,
    datasets: [{ label: ch.label || 'Série', data: ch.data }],
  }
}

function getDashType(asset) {
  if (asset.tipo === 'PBI') return 'Power BI'
  if (asset.tipo === 'grafico') return 'Gráfico'
  if (asset.tipo === 'interno') return 'Interno'
  if (asset.tipo === 'rpa') return 'RPA'
  return asset.tipo || 'Dashboard'
}

function getTypeVariant(type) {
  if (type === 'Power BI') return 'primary'
  if (type === 'Interno') return 'success'
  if (type === 'RPA') return 'default'
  return 'default'
}

export default function Dashboards() {
  const [regularAssets, setRegularAssets] = useState([])
  const [internalAssets, setInternalAssets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedDash, setSelectedDash] = useState(null)

  const [indFilters, setIndFilters] = useState({
    data_inicio: '',
    data_fim: '',
    database: '',
  })
  const [indLoading, setIndLoading] = useState(false)
  const [indError, setIndError] = useState(null)
  const [indRequestId, setIndRequestId] = useState(null)
  const [indStatusUrl, setIndStatusUrl] = useState(null)
  const [indStatus, setIndStatus] = useState(null)
  const [indicators, setIndicators] = useState(null)

  const [relEntregasRequestId, setRelEntregasRequestId] = useState(null)
  const [relEntregasStatus, setRelEntregasStatus] = useState(null)
  const [relEntregasData, setRelEntregasData] = useState(null)
  const [relEntregasError, setRelEntregasError] = useState(null)
  const [relEntregasLoading, setRelEntregasLoading] = useState(false)

  useEffect(() => {
    loadTeamDashboard()
  }, [])

  const handleIndFilterChange = useCallback((id, value) => {
    setIndFilters((prev) => ({ ...prev, [id]: value }))
  }, [])

  const handleIndReset = useCallback(() => {
    setIndFilters({ data_inicio: '', data_fim: '', database: '' })
    setIndicators(null)
    setIndError(null)
    setIndRequestId(null)
    setIndStatusUrl(null)
    setIndStatus(null)
  }, [])

  const indFilterConfig = useMemo(
    () => [
      { id: 'data_inicio', label: 'Data Início', type: 'date', value: indFilters.data_inicio },
      { id: 'data_fim', label: 'Data Fim', type: 'date', value: indFilters.data_fim },
      {
        id: 'database',
        label: 'Base de Dados',
        type: 'select',
        value: indFilters.database,
        options: [
          { value: '', label: 'Padrão' },
          { value: 'azportoex', label: 'MATRIZ (azportoex)' },
          { value: 'portoexsp', label: 'FILIAL (portoexsp)' },
        ],
      },
    ],
    [indFilters]
  )

  const handleIndApply = useCallback(async () => {
    setIndLoading(true)
    setIndError(null)
    setIndStatus(null)
    setIndicators(null)
    setIndRequestId(null)
    setIndStatusUrl(null)

    try {
      const params = {}
      if (indFilters.data_inicio) params.data_inicio = indFilters.data_inicio
      if (indFilters.data_fim) params.data_fim = indFilters.data_fim
      if (indFilters.database) params.database = indFilters.database

      const qs = new URLSearchParams(params).toString()
      const url = qs ? `${api.dashboardIndicators}?${qs}` : api.dashboardIndicators
      const res = await httpGet(url)

      if (res?.status === 'pending' && res?.request_id && res?.status_url) {
        setIndRequestId(res.request_id)
        setIndStatusUrl(res.status_url)
        setIndStatus('pending')
        return
      }

      const inds = res?.indicators
      if (!inds || typeof inds !== 'object') {
        throw new Error('Resposta inválida: indicators ausente')
      }
      setIndicators(inds)
      setIndStatus('completed')
    } catch (e) {
      setIndError(e?.message || 'Erro ao carregar indicadores')
    } finally {
      setIndLoading(false)
    }
  }, [indFilters])

  const isRelatorioEntregas376 = selectedDash?.asset_config?.internal_key === 'relatorio_entregas_376'

  useEffect(() => {
    if (!indRequestId || !indStatusUrl) return

    let timer = null
    let cancelled = false

    const poll = async () => {
      try {
        const st = await httpGet(indStatusUrl)
        if (cancelled) return
        const status = st?.status || null
        setIndStatus(status)

        if (status === 'completed') {
          const inds = st?.data?.indicators
          if (!inds || typeof inds !== 'object') {
            setIndError('Resposta inválida: indicators ausente')
            return
          }
          setIndicators(inds)
          return
        }

        if (status === 'failed') {
          setIndError(st?.error || 'Falha ao gerar indicadores')
          return
        }

        timer = setTimeout(poll, 2000)
      } catch (e) {
        if (cancelled) return
        setIndError(e?.message || 'Erro ao consultar status dos indicadores')
      }
    }

    poll()

    return () => {
      cancelled = true
      if (timer) clearTimeout(timer)
    }
  }, [indRequestId, indStatusUrl])

  useEffect(() => {
    if (!isRelatorioEntregas376) return

    let timer = null
    let cancelled = false

    async function start() {
      setRelEntregasLoading(true)
      setRelEntregasError(null)
      setRelEntregasStatus(null)
      setRelEntregasData(null)
      setRelEntregasRequestId(null)

      try {
        const res = await httpGet(api.relatorioEntregas)
        const requestId = res?.request_id
        if (!requestId) {
          throw new Error('Falha ao criar request do relatório (sem request_id)')
        }
        if (cancelled) return

        setRelEntregasRequestId(requestId)
        setRelEntregasStatus('pending')

        const poll = async () => {
          try {
            const st = await httpGet(api.relatorioEntregasStatus(requestId))
            if (cancelled) return
            const status = st?.status || null
            setRelEntregasStatus(status)

            if (status === 'completed') {
              const payload = st?.data?.payload ?? st?.data ?? null
              setRelEntregasData(payload)
              setRelEntregasLoading(false)
              return
            }
            if (status === 'failed') {
              setRelEntregasError(st?.error || 'Falha ao gerar relatório')
              setRelEntregasLoading(false)
              return
            }

            timer = setTimeout(poll, 2000)
          } catch (e) {
            if (cancelled) return
            setRelEntregasError(e?.message || 'Erro ao consultar status do relatório')
            setRelEntregasLoading(false)
          }
        }

        poll()
      } catch (e) {
        if (cancelled) return
        setRelEntregasError(e?.message || 'Erro ao iniciar relatório')
        setRelEntregasLoading(false)
      }
    }

    start()

    return () => {
      cancelled = true
      if (timer) clearTimeout(timer)
    }
  }, [isRelatorioEntregas376])

  async function loadTeamDashboard() {
    setLoading(true)
    setError(null)
    try {
      const data = await httpGet(api.teamDashboard)
      setRegularAssets(Array.isArray(data.regular_assets) ? data.regular_assets : [])
      setInternalAssets(Array.isArray(data.internal_assets) ? data.internal_assets : [])
    } catch (err) {
      setError(err.message)
      setRegularAssets([])
      setInternalAssets([])
    } finally {
      setLoading(false)
    }
  }

  const allDashboards = [...regularAssets, ...internalAssets]

  const relEntregasAggregated = useMemo(() => {
    const ag = relEntregasData?.agregado
    if (ag && typeof ag === 'object') {
      return {
        total: Number(ag.total) || 0,
        no_prazo: Number(ag.no_prazo) || 0,
        fora_prazo: Number(ag.fora_prazo) || 0,
        sem_previsao: Number(ag.sem_previsao) || 0,
      }
    }

    const counts = relEntregasData?.status_counts
    if (!counts || typeof counts !== 'object') {
      return { total: 0, no_prazo: 0, fora_prazo: 0, sem_previsao: 0 }
    }

    const total = Object.values(counts).reduce((acc, v) => acc + (Number(v) || 0), 0)
    const keysNoPrazo = new Set([
      'ENTREGUE NO PRAZO',
      'NO PRAZO',
      'NO PRAZO (IN.CLIENTE)',
      'ENTREGUE NO PRAZO (IN.CLIENTE)',
    ])
    const keysFora = new Set([
      'ENTREGUE FORA DO PRAZO',
      'FORA DO PRAZO',
      'FORA DO PRAZO (IN.CLIENTE)',
      'ENTREGUE FORA DO PRAZO (IN.CLIENTE)',
    ])
    const keysSem = new Set(['SEM PREVISAO', 'SEM PREVISÃO', 'PRAZO CONGELADO'])

    let noPrazo = 0
    let foraPrazo = 0
    let semPrev = 0
    for (const [k, vRaw] of Object.entries(counts)) {
      const v = Number(vRaw) || 0
      const key = String(k || '').trim().toUpperCase()
      if (keysNoPrazo.has(key)) noPrazo += v
      else if (keysFora.has(key)) foraPrazo += v
      else if (keysSem.has(key)) semPrev += v
    }
    return { total, no_prazo: noPrazo, fora_prazo: foraPrazo, sem_previsao: semPrev }
  }, [relEntregasData])

  const relEntregasPctNoPrazo = useMemo(() => {
    if (!relEntregasAggregated.total) return 0
    return (relEntregasAggregated.no_prazo / relEntregasAggregated.total) * 100
  }, [relEntregasAggregated])

  const relEntregasPctForaPrazo = useMemo(() => {
    if (!relEntregasAggregated.total) return 0
    return (relEntregasAggregated.fora_prazo / relEntregasAggregated.total) * 100
  }, [relEntregasAggregated])

  const relEntregasPie = useMemo(() => {
    if (!relEntregasAggregated.total) return null
    return {
      id: 'relatorio-entregas-376-pie',
      type: 'pie',
      title: 'Distribuição (agregado)',
      labels: ['No Prazo', 'Fora do Prazo', 'Sem Previsão'],
      datasets: [
        {
          label: 'Entregas',
          data: [relEntregasAggregated.no_prazo, relEntregasAggregated.fora_prazo, relEntregasAggregated.sem_previsao],
        },
      ],
    }
  }, [relEntregasAggregated])

  function GaugeCard({ title, percent, subtitle, variant }) {
    const pct = Number.isFinite(percent) ? Math.max(0, Math.min(100, percent)) : 0
    const color = variant === 'danger' ? 'hsl(var(--destructive))' : 'hsl(var(--success, 142 71% 45%))'
    const track = 'hsl(var(--muted))'

    return (
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-foreground">{title}</h4>
          <span className="text-xs text-muted-foreground">{pct.toFixed(1)}%</span>
        </div>
        <div className="mt-3 flex items-center gap-4">
          <div
            className="relative h-20 w-20 rounded-full"
            style={{
              background: `conic-gradient(${color} ${pct}%, ${track} ${pct}% 100%)`,
            }}
          >
            <div className="absolute inset-2 rounded-full bg-background" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-foreground">{pct.toFixed(0)}%</span>
            </div>
          </div>
          <div className="flex-1">
            <div className="text-xs text-muted-foreground">{subtitle}</div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Dashboards</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Painéis e relatórios visuais (mesmo modelo do dashboard da equipe)
          </p>
        </div>
        <Button variant="outline" onClick={loadTeamDashboard} size="sm">
          Atualizar
        </Button>
      </div>

      <FilterBar
        filters={indFilterConfig}
        onChange={handleIndFilterChange}
        onReset={handleIndReset}
        onApply={handleIndApply}
      />

      {indLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <SkeletonKpi key={i} />
          ))}
        </div>
      ) : indError ? (
        <Card className="border-destructive/20 bg-destructive/5">
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm text-destructive">{indError}</p>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Status</p>
              <p className="text-xs font-medium text-foreground">{indStatus || '—'}</p>
            </div>
          </div>
        </Card>
      ) : indicators ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="stagger-child">
            <KpiCard label="Total Fretes" value={(Number(indicators.totalFretes || 0) || 0).toLocaleString('pt-BR')} />
          </div>
          <div className="stagger-child">
            <KpiCard label="Fretes/Mês" value={(Number(indicators.fretesMes || 0) || 0).toLocaleString('pt-BR')} />
          </div>
          <div className="stagger-child">
            <KpiCard label="Performance" value={`${(Number(indicators.performance || 0) || 0).toFixed(1)}%`} />
          </div>
          <div className="stagger-child">
            <KpiCard label="Economia" value={(Number(indicators.economiaGerada || 0) || 0).toLocaleString('pt-BR')} />
          </div>
        </div>
      ) : (
        <Card className="border-dashed">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">Aplique os filtros para carregar os indicadores do Dashboard.</p>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Status</p>
              <p className="text-xs font-medium text-foreground">{indStatus || '—'}</p>
            </div>
          </div>
        </Card>
      )}

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : error ? (
        <Card className="border-destructive/20 bg-destructive/5">
          <p className="text-sm text-destructive">{error}</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={loadTeamDashboard}>
            Tentar novamente
          </Button>
        </Card>
      ) : allDashboards.length === 0 ? (
        <EmptyState
          icon={BarChart2}
          title="Nenhum dashboard disponível"
          description="Entre em contato com o administrador para liberar acesso aos dashboards."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {allDashboards.map((asset, idx) => {
            const dashType = getDashType(asset)
            const nome = asset.nome || `Dashboard ${idx + 1}`
            const descricao = asset.descricao || 'Sem descrição disponível.'
            const embedUrl = asset.embed_url
            const resourceUrl = asset.resource_url
            const chartConfig = assetToChartConfig(asset)

            return (
              <div key={asset.id || idx} className="stagger-child">
                {chartConfig ? (
                  <Card hover className="flex h-full flex-col overflow-hidden">
                    <div className="flex items-center justify-between px-4 pt-4 pb-1">
                      <CardTitle className="text-base">{nome}</CardTitle>
                      <Badge variant={getTypeVariant(dashType)}>{dashType}</Badge>
                    </div>
                    <div className="flex-1 min-h-[200px] px-2">
                      <ChartCard chart={chartConfig} className="border-0 shadow-none" noTitle />
                    </div>
                    <div className="p-4 pt-0">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() =>
                          setSelectedDash({
                            ...asset,
                            name: nome,
                            chartConfig,
                          })
                        }
                      >
                        <Eye size={14} />
                        Visualizar gráfico
                      </Button>
                    </div>
                  </Card>
                ) : (
                  <Card hover className="flex h-full flex-col justify-between">
                    <div>
                      <div className="mb-3 flex items-start justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                          <Monitor size={20} className="text-primary" />
                        </div>
                        <div className="flex flex-wrap gap-1 justify-end">
                          <Badge variant={getTypeVariant(dashType)}>{dashType}</Badge>
                          {asset.categoria && (
                            <Badge variant="outline" className="text-[10px]">
                              {asset.categoria}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <CardTitle>{nome}</CardTitle>
                      <CardDescription className="mt-1 line-clamp-2">
                        {descricao}
                      </CardDescription>
                    </div>

                    <div className="mt-4 flex gap-2">
                      {(embedUrl || resourceUrl) && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() =>
                            setSelectedDash({
                              ...asset,
                              embed_url: embedUrl || resourceUrl,
                              name: nome,
                            })
                          }
                        >
                          <Eye size={14} />
                          Visualizar
                        </Button>
                      )}
                      {resourceUrl && !embedUrl && (
                        <a
                          href={resourceUrl.startsWith('http') ? resourceUrl : `${env.backendUrl || ''}${resourceUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex h-8 items-center justify-center rounded-md border border-border bg-transparent px-3 text-xs font-medium text-foreground transition-colors hover:bg-accent"
                        >
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  </Card>
                )}
              </div>
            )
          })}
        </div>
      )}

      <Modal
        open={!!selectedDash}
        onClose={() => setSelectedDash(null)}
        title={selectedDash?.name || selectedDash?.nome || 'Dashboard'}
        size={selectedDash?.chartConfig ? 'xl' : 'full'}
      >
        {selectedDash?.chartConfig ? (
          <div className="min-h-[320px]">
            <ChartCard chart={selectedDash.chartConfig} />
          </div>
        ) : isRelatorioEntregas376 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Request</p>
                <p className="text-sm font-medium text-foreground">{relEntregasRequestId ? `#${relEntregasRequestId}` : '—'}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="text-sm font-medium text-foreground">{relEntregasStatus || (relEntregasLoading ? 'carregando…' : '—')}</p>
              </div>
            </div>

            {relEntregasError ? (
              <Card className="border-destructive/20 bg-destructive/5">
                <p className="text-sm text-destructive">{relEntregasError}</p>
              </Card>
            ) : null}

            {relEntregasLoading ? (
              <Card>
                <p className="text-sm text-muted-foreground">Gerando relatório… aguarde alguns segundos.</p>
              </Card>
            ) : null}

            {relEntregasData ? (
              <>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <GaugeCard
                    title="No Prazo"
                    percent={relEntregasPctNoPrazo}
                    subtitle={`${relEntregasAggregated.no_prazo.toLocaleString('pt-BR')} de ${relEntregasAggregated.total.toLocaleString('pt-BR')} entregas`}
                    variant="ok"
                  />
                  <GaugeCard
                    title="Fora do Prazo"
                    percent={relEntregasPctForaPrazo}
                    subtitle={`${relEntregasAggregated.fora_prazo.toLocaleString('pt-BR')} de ${relEntregasAggregated.total.toLocaleString('pt-BR')} entregas`}
                    variant="danger"
                  />
                </div>

                {relEntregasPie ? (
                  <ChartCard chart={relEntregasPie} />
                ) : null}

                {Array.isArray(relEntregasData?.por_agente) && relEntregasData.por_agente.length > 0 ? (
                  <Card className="overflow-hidden">
                    <CardTitle className="text-base">Performance por Agente</CardTitle>
                    <div className="mt-3 overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-muted/50">
                          <tr>
                            <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Agente</th>
                            <th className="px-3 py-2 text-right text-xs font-medium text-muted-foreground">No Prazo</th>
                            <th className="px-3 py-2 text-right text-xs font-medium text-muted-foreground">Fora</th>
                            <th className="px-3 py-2 text-right text-xs font-medium text-muted-foreground">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {relEntregasData.por_agente.slice(0, 50).map((row, i) => (
                            <tr key={i} className="border-t">
                              <td className="px-3 py-2">{row.agente || row.nome || '—'}</td>
                              <td className="px-3 py-2 text-right">{Number(row.no_prazo || 0).toLocaleString('pt-BR')}</td>
                              <td className="px-3 py-2 text-right">{Number(row.fora_prazo || 0).toLocaleString('pt-BR')}</td>
                              <td className="px-3 py-2 text-right">{Number(row.total || 0).toLocaleString('pt-BR')}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                ) : null}
              </>
            ) : null}
          </div>
        ) : selectedDash?.embed_url ? (
          <div className="aspect-video w-full overflow-hidden rounded-lg border border-border bg-muted">
            <iframe
              src={selectedDash.embed_url}
              className="h-full w-full min-h-[60vh]"
              title={selectedDash.name || 'Dashboard'}
              frameBorder="0"
              allowFullScreen
            />
          </div>
        ) : (
          <EmptyState
            icon={Monitor}
            title="Sem visualização disponível"
            description="Este dashboard não possui uma URL de embed ou gráfico configurado."
          />
        )}
      </Modal>
    </div>
  )
}
