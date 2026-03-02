import { useMemo } from 'react'
import { useOccurrences } from '../hooks/useOccurrences'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { BarChart3, DollarSign, TrendingUp, RefreshCw, Activity, Target, AlertTriangle, PieChart } from 'lucide-react'

const CATEGORIES = [
  { id: 'cliente', label: 'Cliente', emoji: '👤' },
  { id: 'comercial', label: 'Comercial', emoji: '💼' },
  { id: 'atendimento', label: 'Atendimento', emoji: '📞' },
  { id: 'operacao', label: 'Operação', emoji: '🚚' },
  { id: 'armazem', label: 'Armazém', emoji: '🏭' },
  { id: 'financeiro', label: 'Financeiro', emoji: '💰' },
  { id: 'planejamento', label: 'Planejamento', emoji: '📋' },
  { id: 'motorista', label: 'Motorista', emoji: '👷' },
  { id: 'externo', label: 'Externo', emoji: '🌍' }
]

const COLORS = [
  '#1e40af', '#eab308', '#16a34a', '#dc2626', '#2563eb',
  '#7c3aed', '#f59e0b', '#059669', '#be185d'
]

export default function DashboardTab() {
  const { occurrences, loading } = useOccurrences()

  const stats = useMemo(() => {
    const total = occurrences.length
    const custoTotal = occurrences.reduce((s, o) => s + (o.impacto_financeiro || 0), 0)
    const reprogramadas = occurrences.filter((o) => o.reprogramado === 'Sim').length
    const taxaReprogram = total > 0 ? ((reprogramadas / total) * 100).toFixed(1) : "0"

    const internaIds = ["operacao", "armazem", "planejamento", "atendimento", "comercial", "financeiro", "motorista"]
    const internas = occurrences.filter((o) => internaIds.includes(o.categoria)).length
    const pctInterna = total > 0 ? ((internas / total) * 100).toFixed(0) : "0"

    // ICO (simulated total CTEs = occurrences * 8 for demo)
    const totalCTEs = total * 8
    const ico = totalCTEs > 0 ? (1 - total / totalCTEs).toFixed(3) : "1.000"

    // By category
    const byCat = {}
    occurrences.forEach((o) => {
      byCat[o.categoria] = (byCat[o.categoria] || 0) + 1
    })
    const catData = CATEGORIES.map((c) => ({
      name: c.label,
      emoji: c.emoji,
      value: byCat[c.id] || 0,
    })).filter((d) => d.value > 0).sort((a, b) => b.value - a.value)

    // By status
    const byStatus = {}
    occurrences.forEach((o) => {
      const status = o.status || 'Aberto'
      byStatus[status] = (byStatus[status] || 0) + 1
    })
    const statusData = Object.entries(byStatus).map(([name, value]) => ({ name, value }))

    // Cost by category
    const costByCat = {}
    occurrences.forEach((o) => {
      const label = CATEGORIES.find(c => c.id === o.categoria)?.label || o.categoria
      costByCat[label] = (costByCat[label] || 0) + (o.impacto_financeiro || 0)
    })
    const costData = Object.entries(costByCat)
      .sort((a, b) => b[1] - a[1])
      .map(([name, value]) => ({ name, value }))

    return { total, custoTotal, taxaReprogram, pctInterna, ico, catData, statusData, costData }
  }, [occurrences])

  const KPICard = ({ icon: Icon, label, value, sub, accent }) => (
    <Card className={accent ? "border-primary/30 bg-primary/5" : ""}>
      <CardContent className="pt-5 pb-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
          </div>
          <div className={`p-2 rounded-lg ${accent ? "bg-primary/20" : "bg-muted"}`}>
            <Icon className={`h-4 w-4 ${accent ? "text-primary" : "text-muted-foreground"}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  )

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
          <BarChart3 className="h-6 w-6" />
          Dashboard Analytics
        </h2>
        <p className="text-muted-foreground">
          Métricas e visualizações das ocorrências operacionais
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          icon={Activity}
          label="Total Ocorrências"
          value={stats.total.toString()}
          sub="Últimos 30 dias"
        />
        <KPICard
          icon={DollarSign}
          label="Custo Total"
          value={`R$ ${stats.custoTotal.toFixed(2)}`}
          sub="Impacto financeiro"
        />
        <KPICard
          icon={RefreshCw}
          label="Taxa Reprogram."
          value={`${stats.taxaReprogram}%`}
          sub="Das entregas"
        />
        <KPICard
          icon={Target}
          label="ICO"
          value={stats.ico}
          sub="Índice de conformidade"
          accent
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* By Category */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Ocorrências por Categoria
            </CardTitle>
            <CardDescription>
              Distribuição das ocorrências por tipo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.catData.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm">{item.emoji} {item.name}</span>
                  </div>
                  <Badge variant="secondary">{item.value}</Badge>
                </div>
              ))}
              {stats.catData.length === 0 && (
                <p className="text-center text-muted-foreground py-4">Nenhum dado disponível</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* By Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Status das Ocorrências
            </CardTitle>
            <CardDescription>
              Situação atual das ocorrências registradas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.statusData.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between">
                  <span className="text-sm">{item.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-muted rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-primary"
                        style={{ 
                          width: `${(item.value / stats.total) * 100}%`,
                          backgroundColor: COLORS[index % COLORS.length]
                        }}
                      />
                    </div>
                    <Badge variant="secondary">{item.value}</Badge>
                  </div>
                </div>
              ))}
              {stats.statusData.length === 0 && (
                <p className="text-center text-muted-foreground py-4">Nenhum dado disponível</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cost Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Custo por Categoria
          </CardTitle>
          <CardDescription>
            Impacto financeiro segmentado por categoria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.costData.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between">
                <span className="text-sm">{item.name}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-muted rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-orange-500"
                      style={{ 
                        width: `${(item.value / stats.custoTotal) * 100}%`
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium">R$ {item.value.toFixed(2)}</span>
                </div>
              </div>
            ))}
            {stats.costData.length === 0 && (
              <p className="text-center text-muted-foreground py-4">Nenhum dado disponível</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">📊 Insights Principais</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-medium text-primary">Taxa de Problemas Internos</p>
              <p className="text-muted-foreground">{stats.pctInterna}% das ocorrências são de responsabilidade interna</p>
            </div>
            <div>
              <p className="font-medium text-primary">Custo Médio por Ocorrência</p>
              <p className="text-muted-foreground">R$ {stats.total > 0 ? (stats.custoTotal / stats.total).toFixed(2) : '0.00'}</p>
            </div>
            <div>
              <p className="font-medium text-primary">Índice de Conformidade</p>
              <p className="text-muted-foreground">ICO de {stats.ico} ({(parseFloat(stats.ico) * 100).toFixed(1)}% de conformidade)</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
