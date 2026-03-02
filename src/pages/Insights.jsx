import { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, Users, Package, Clock, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'

// Dados mockados para demonstração - substitua com dados reais da API
const mockKpis = [
  { title: 'Total de Operações', value: '1,234', change: '+12%', icon: Package, color: 'text-blue-600' },
  { title: 'Motoristas Ativos', value: '89', change: '+5%', icon: Users, color: 'text-green-600' },
  { title: 'Pontualidade', value: '94%', change: '+2%', icon: Clock, color: 'text-purple-600' },
  { title: 'Alertas', value: '3', change: '-1', icon: AlertTriangle, color: 'text-orange-600' },
]

const mockChartData = [
  { month: 'Jan', entregues: 65, atrasadas: 12 },
  { month: 'Fev', entregues: 78, atrasadas: 8 },
  { month: 'Mar', entregues: 90, atrasadas: 15 },
  { month: 'Abr', entregues: 81, atrasadas: 10 },
  { month: 'Mai', entregues: 95, atrasadas: 7 },
  { month: 'Jun', entregues: 112, atrasadas: 9 },
]

export default function Insights() {
  const [kpis, setKpis] = useState(mockKpis)
  const [chartData, setChartData] = useState(mockChartData)
  const [loading, setLoading] = useState(false)

  // Futuramente: buscar dados da API
  useEffect(() => {
    // Exemplo de como buscar dados da API:
    // const fetchInsightsData = async () => {
    //   setLoading(true)
    //   try {
    //     const response = await fetch('/api/insights/kpis')
    //     const data = await response.json()
    //     setKpis(data.kpis)
    //     setChartData(data.chartData)
    //   } catch (error) {
    //     console.error('Erro ao buscar dados:', error)
    //   } finally {
    //     setLoading(false)
    //   }
    // }
    // fetchInsightsData()
  }, [])

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Insights</h1>
          <p className="text-muted-foreground">
            Análise de dados e métricas operacionais em tempo real
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          Última atualização: Agora
        </Badge>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                <Icon className={`h-4 w-4 ${kpi.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className={kpi.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                    {kpi.change}
                  </span>{' '}
                  em relação ao mês anterior
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Chart Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Volume de Entregas
            </CardTitle>
            <CardDescription>
              Comparativo entre entregues e atrasadas nos últimos 6 meses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {chartData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.month}</span>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <span className="text-sm">{item.entregues}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-red-500" />
                      <span className="text-sm">{item.atrasadas}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Tendência de Performance
            </CardTitle>
            <CardDescription>
              Análise de tendências e previsões para os próximos meses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Eficiência Operacional</span>
                <Badge variant="default">94%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Taxa de Crescimento</span>
                <Badge variant="secondary">+8.5%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Previsão Próximo Mês</span>
                <Badge variant="outline">+125 operações</Badge>
              </div>
              <div className="pt-2">
                <div className="text-sm text-muted-foreground">
                  Com base nos dados históricos, esperamos um crescimento de 8.5% no volume de operações para o próximo mês.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Insights Adicionais</CardTitle>
          <CardDescription>
            Observações e recomendações baseadas nos dados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="font-medium text-sm">Otimização de Rotas</span>
              </div>
              <p className="text-xs text-muted-foreground">
                A otimização de rotas pode reduzir o tempo de entrega em até 15%
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-sm">Performance Motoristas</span>
              </div>
              <p className="text-xs text-muted-foreground">
                3 motoristas estão acima da média de performance
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <span className="font-medium text-sm">Pontos de Atenção</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Horário pico entre 14h-18h requer mais recursos
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
