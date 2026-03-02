import { useMemo } from 'react'
import { useOccurrences } from '../hooks/useOccurrences'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Grid3X3, AlertTriangle, TrendingUp, Target } from 'lucide-react'

const impactLabels = {
  1: "Sem impacto",
  2: "Atraso leve",
  3: "Reprogramação",
  4: "Custo extra",
  5: "Perda cliente/imagem",
}

const freqLabels = {
  1: "Raro",
  2: "Ocasional",
  3: "Frequente",
  4: "Muito frequente",
  5: "Crônico",
}

function getCellColor(score) {
  if (score >= 20) return "bg-red-500 text-white"
  if (score >= 12) return "bg-orange-500 text-white"
  if (score >= 6) return "bg-yellow-500 text-black"
  if (score >= 3) return "bg-blue-500 text-white"
  return "bg-gray-200 text-gray-700"
}

function getRiskLabel(score) {
  if (score >= 20) return "Crítico"
  if (score >= 12) return "Alto"
  if (score >= 6) return "Moderado"
  if (score >= 3) return "Baixo"
  return "Mínimo"
}

export default function MatrizImpacto() {
  const { occurrences, loading } = useOccurrences()

  // Aggregate occurrences into matrix cells
  const matrixData = useMemo(() => {
    const grid = {}
    occurrences.forEach((o) => {
      const impactoScore = o.impacto_score || 3
      const frequenciaScore = o.frequencia || 2
      const key = `${impactoScore}-${frequenciaScore}`
      if (!grid[key]) grid[key] = []
      grid[key].push(o)
    })
    return grid
  }, [occurrences])

  // Ranked list
  const ranked = useMemo(() => {
    return [...occurrences]
      .map((o) => ({ 
        ...o, 
        riskScore: (o.impacto_score || 3) * (o.frequencia || 2),
        impactoScore: o.impacto_score || 3,
        frequenciaScore: o.frequencia || 2
      }))
      .sort((a, b) => b.riskScore - a.riskScore)
  }, [occurrences])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Grid3X3 className="h-6 w-6" />
          Matriz de Impacto × Frequência
        </h2>
        <p className="text-muted-foreground">
          Classifique cada ocorrência para descobrir onde atacar primeiro
        </p>
      </div>

      {/* Matrix Grid */}
      <Card>
        <CardContent className="pt-6 overflow-x-auto">
          <div className="min-w-[600px]">
            <div className="flex items-end mb-2">
              <div className="w-28" />
              <div className="flex-1 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Frequência →
              </div>
            </div>
            <div className="flex">
              <div className="w-28 flex flex-col justify-center">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider [writing-mode:vertical-lr] rotate-180 mx-auto">
                  Impacto →
                </span>
              </div>
              <div className="flex-1">
                {/* Header row */}
                <div className="grid grid-cols-6 gap-1 mb-1">
                  <div />
                  {[1, 2, 3, 4, 5].map((f) => (
                    <div key={f} className="text-center text-xs font-medium text-muted-foreground p-1">
                      {f} - {freqLabels[f]}
                    </div>
                  ))}
                </div>
                {/* Grid rows (5 down to 1) */}
                {[5, 4, 3, 2, 1].map((imp) => (
                  <div key={imp} className="grid grid-cols-6 gap-1 mb-1">
                    <div className="flex items-center text-xs font-medium text-muted-foreground pr-2 justify-end">
                      {imp} - {impactLabels[imp]}
                    </div>
                    {[1, 2, 3, 4, 5].map((freq) => {
                      const key = `${imp}-${freq}`
                      const items = matrixData[key] || []
                      const score = imp * freq
                      return (
                        <div
                          key={freq}
                          className={`rounded-md p-2 min-h-[56px] flex flex-col items-center justify-center transition-all ${getCellColor(score)}`}
                        >
                          <span className="text-lg font-bold">{score}</span>
                          {items.length > 0 && (
                            <Badge variant="secondary" className="text-[10px] mt-0.5 px-1.5 bg-white/20 text-white">
                              {items.length} oc.
                            </Badge>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {[
          { label: "Mínimo (1-2)", cls: "bg-gray-200" },
          { label: "Baixo (3-5)", cls: "bg-blue-500" },
          { label: "Moderado (6-11)", cls: "bg-yellow-500" },
          { label: "Alto (12-19)", cls: "bg-orange-500" },
          { label: "Crítico (20-25)", cls: "bg-red-500" },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-1.5 text-xs">
            <div className={`w-4 h-4 rounded ${l.cls}`} />
            {l.label}
          </div>
        ))}
      </div>

      {/* Ranked List */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Target className="h-4 w-4" />
            Ranking de Risco (onde atacar primeiro)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {ranked.slice(0, 10).map((o, i) => (
              <div key={o.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className={`w-8 h-8 rounded-md flex items-center justify-center font-bold text-sm ${getCellColor(o.riskScore)}`}>
                  {o.riskScore}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm truncate">{o.responsavel || 'Não informado'}</span>
                    <Badge variant="outline" className="text-[10px] shrink-0">
                      {o.categoria}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{o.descricao}</p>
                </div>
                <Badge variant="outline" className={`text-[10px] ${getCellColor(o.riskScore)}`}>
                  {getRiskLabel(o.riskScore)}
                </Badge>
              </div>
            ))}
            {ranked.length === 0 && (
              <p className="text-center text-muted-foreground py-4">Nenhuma ocorrência encontrada</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Summary Card */}
      <Card className="bg-gradient-to-r from-orange-500/5 to-red-500/5 border-orange-200">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <h3 className="font-semibold">🎯 Estratégia de Priorização</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-medium text-orange-600">Críticos (Score ≥ 20)</p>
              <p className="text-muted-foreground">Atenção imediata! Impacto alto + frequência alta</p>
            </div>
            <div>
              <p className="font-medium text-orange-600">Altos (Score 12-19)</p>
              <p className="text-muted-foreground">Prioridade alta. Monitorar e agir em breve</p>
            </div>
            <div>
              <p className="font-medium text-orange-600">Moderados (Score 6-11)</p>
              <p className="text-muted-foreground">Melhorias contínuas. Planejar ações</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
