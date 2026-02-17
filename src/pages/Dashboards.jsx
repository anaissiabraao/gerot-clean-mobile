import { useState, useEffect } from 'react'
import { ExternalLink, BarChart2, Monitor, Eye } from 'lucide-react'
import { httpGet } from '../services/httpClient'
import api from '../api/endpoints'
import env from '../config/env'
import { Card, CardTitle, CardDescription } from '../components/ui/Card'
import { ChartCard } from '../components/ui/ChartCard'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { EmptyState } from '../components/ui/EmptyState'
import { SkeletonCard } from '../components/ui/Skeleton'

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

  useEffect(() => {
    loadTeamDashboard()
  }, [])

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
