import { useState, useEffect } from 'react'
import { ExternalLink, BarChart2, Monitor, Eye } from 'lucide-react'
import { httpGet } from '../services/httpClient'
import api from '../api/endpoints'
import { Card, CardTitle, CardDescription } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { EmptyState } from '../components/ui/EmptyState'
import { SkeletonCard } from '../components/ui/Skeleton'

export default function Dashboards() {
  const [environments, setEnvironments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedDash, setSelectedDash] = useState(null)

  useEffect(() => {
    loadEnvironments()
  }, [])

  async function loadEnvironments() {
    setLoading(true)
    setError(null)
    try {
      const data = await httpGet(api.environments)
      setEnvironments(Array.isArray(data) ? data : data?.environments || data?.data || [])
    } catch (err) {
      setError(err.message)
      setEnvironments([])
    } finally {
      setLoading(false)
    }
  }

  function getDashType(env) {
    if (env.type === 'power_bi' || env.embed_url?.includes('powerbi')) return 'Power BI'
    if (env.type === 'internal' || env.type === 'interno') return 'Interno'
    return env.type || 'Dashboard'
  }

  function getTypeVariant(type) {
    if (type === 'Power BI') return 'primary'
    if (type === 'Interno') return 'success'
    return 'default'
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Dashboards</h2>
          <p className="mt-1 text-sm text-muted-foreground">Painéis e relatórios visuais</p>
        </div>
        <Button variant="outline" onClick={loadEnvironments} size="sm">
          Atualizar
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : error ? (
        <Card className="border-destructive/20 bg-destructive/5">
          <p className="text-sm text-destructive">{error}</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={loadEnvironments}>
            Tentar novamente
          </Button>
        </Card>
      ) : environments.length === 0 ? (
        <EmptyState
          icon={BarChart2}
          title="Nenhum dashboard disponível"
          description="Dashboards autorizados para sua conta aparecerão aqui."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {environments.map((env, idx) => {
            const dashType = getDashType(env)
            return (
              <div key={env.id || idx} className="stagger-child">
                <Card hover className="flex h-full flex-col justify-between">
                  <div>
                    <div className="mb-3 flex items-start justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                        <Monitor size={20} className="text-primary" />
                      </div>
                      <Badge variant={getTypeVariant(dashType)}>{dashType}</Badge>
                    </div>
                    <CardTitle>{env.name || env.title || `Dashboard ${idx + 1}`}</CardTitle>
                    <CardDescription className="mt-1 line-clamp-2">
                      {env.description || 'Sem descrição disponível'}
                    </CardDescription>

                    {/* Resource count */}
                    {env.resources && env.resources.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {env.resources.slice(0, 3).map((r, ri) => (
                          <Badge key={ri} variant="outline" className="text-[10px]">
                            {r.name || r.title || `Item ${ri + 1}`}
                          </Badge>
                        ))}
                        {env.resources.length > 3 && (
                          <Badge variant="outline" className="text-[10px]">
                            +{env.resources.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => setSelectedDash(env)}
                    >
                      <Eye size={14} />
                      Visualizar
                    </Button>
                    {env.url && (
                      <a
                        href={env.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-8 items-center justify-center rounded-md border border-border bg-transparent px-3 text-xs font-medium text-foreground transition-colors hover:bg-accent"
                      >
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </Card>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal for viewing dashboard */}
      <Modal
        open={!!selectedDash}
        onClose={() => setSelectedDash(null)}
        title={selectedDash?.name || selectedDash?.title || 'Dashboard'}
        size="full"
      >
        {selectedDash?.embed_url || selectedDash?.url ? (
          <div className="aspect-video w-full overflow-hidden rounded-lg border border-border bg-muted">
            <iframe
              src={selectedDash.embed_url || selectedDash.url}
              className="h-full w-full"
              title={selectedDash.name || 'Dashboard'}
              frameBorder="0"
              allowFullScreen
            />
          </div>
        ) : (
          <EmptyState
            icon={Monitor}
            title="Sem visualização disponível"
            description="Este dashboard não possui uma URL de embed configurada."
          />
        )}
      </Modal>
    </div>
  )
}
