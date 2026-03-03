import { useMemo } from 'react'
import { useOccurrences } from '../hooks/useOccurrences'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Tags, Target, TrendingUp } from 'lucide-react'
import { CATEGORIES, SUBCATEGORIES } from '../data/occurrences'

export default function Categorizacao() {
  const { occurrences } = useOccurrences()

  const stats = useMemo(() => {
    const total = occurrences.length
    const byCategoria = {}
    occurrences.forEach((occ) => {
      const cat = occ.categoria || 'outros'
      byCategoria[cat] = (byCategoria[cat] || 0) + 1
    })

    const top = Object.entries(byCategoria)
      .map(([categoria, value]) => ({ categoria, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 3)

    return { total, top }
  }, [occurrences])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Tags className="h-6 w-6" />
          Categorização Inteligente
        </h2>
        <p className="text-muted-foreground text-sm">
          {stats.total} ocorrências registradas em categorias operacionais padronizadas
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {CATEGORIES.map((cat) => (
          <Card key={cat.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <span className="text-xl">{cat.emoji}</span>
                {cat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1.5">
                {(SUBCATEGORIES[cat.id] || []).map((sub) => (
                  <Badge key={sub.id} variant="outline" className="text-xs font-normal bg-muted/50">
                    {sub.label}
                  </Badge>
                ))}
                {!(SUBCATEGORIES[cat.id] || []).length && (
                  <span className="text-xs text-muted-foreground">Sem subcategorias definidas</span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">🎯 Por que categorizar?</h3>
          </div>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>• Padroniza a captura de dados e acelera decisões do time operacional.</p>
            <p>• Identifica as categorias com maior impacto financeiro.</p>
            <p>• Direciona planos de ação para as subcategorias mais recorrentes.</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-primary">{CATEGORIES.length}</div>
            <p className="text-sm text-muted-foreground">Categorias Principais</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-primary">{Object.values(SUBCATEGORIES).reduce((sum, arr) => sum + arr.length, 0)}</div>
            <p className="text-sm text-muted-foreground">Subcategorias Cadastradas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-primary">{stats.top[0]?.value ?? 0}</div>
            <p className="text-sm text-muted-foreground">Categoria em destaque</p>
            {stats.top[0] && <p className="text-xs text-muted-foreground">{stats.top[0].categoria}</p>}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Top categorias em análise
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.top.map((c) => (
              <div key={c.categoria} className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-sm capitalize">{c.categoria}</p>
                  <p className="text-xs text-muted-foreground">{c.value} ocorrências</p>
                </div>
                <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{ width: `${Math.min((c.value / (stats.total || 1)) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
