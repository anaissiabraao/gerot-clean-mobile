import { useState, useEffect } from 'react'
import { Zap, Play, Library as LibIcon, Loader2 } from 'lucide-react'
import { httpGet, httpPost } from '../services/httpClient'
import api from '../api/endpoints'
import { Card, CardTitle, CardDescription } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { SkeletonCard } from '../components/ui/Skeleton'

export default function Biblioteca() {
  const [catalog, setCatalog] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [runningId, setRunningId] = useState(null)

  useEffect(() => { loadCatalog() }, [])

  async function loadCatalog() {
    setLoading(true)
    setError(null)
    try {
      const data = await httpGet(api.libraryCatalog)
      setCatalog(Array.isArray(data) ? data : data?.catalog || data?.data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleRun(item) {
    const id = item.id || item.name
    setRunningId(id)
    try {
      await httpPost(api.libraryRun, { body: JSON.stringify({ automation_id: id, name: item.name }) })
      alert('Automação executada com sucesso!')
    } catch (err) {
      alert(`Erro: ${err.message}`)
    } finally {
      setRunningId(null)
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Biblioteca</h2>
        <p className="mt-1 text-sm text-muted-foreground">Catálogo de automações e scripts disponíveis</p>
      </div>

      {error && (
        <Card className="border-destructive/20 bg-destructive/5">
          <p className="text-sm text-destructive">{error}</p>
        </Card>
      )}

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : catalog.length === 0 ? (
        <EmptyState
          icon={LibIcon}
          title="Nenhuma automação disponível"
          description="O catálogo de automações aparecerá aqui quando houver itens cadastrados."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {catalog.map((item, idx) => {
            const id = item.id || item.name || idx
            const isRunning = runningId === id
            return (
              <div key={id} className="stagger-child">
                <Card className="flex h-full flex-col justify-between">
                  <div>
                    <div className="mb-3 flex items-start justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                        <Zap size={20} className="text-primary" />
                      </div>
                      {item.category && <Badge>{item.category}</Badge>}
                    </div>
                    <CardTitle>{item.name || item.title || `Automação ${idx + 1}`}</CardTitle>
                    <CardDescription className="mt-1 line-clamp-2">
                      {item.description || 'Sem descrição'}
                    </CardDescription>
                  </div>
                  <div className="mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => handleRun(item)}
                      loading={isRunning}
                    >
                      {!isRunning && <Play size={14} />}
                      Executar
                    </Button>
                  </div>
                </Card>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
