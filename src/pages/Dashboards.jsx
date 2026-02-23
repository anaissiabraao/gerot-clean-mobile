import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
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
import { useAuth } from '../context/useAuth'

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

function toNumber(value) {
  const n = Number(value)
  return Number.isFinite(n) ? n : 0
}

function asArray(value) {
  return Array.isArray(value) ? value : []
}

function normalizeDateLabel(raw, idx) {
  const s = (raw || '').toString()
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    const [, m, d] = s.split('-')
    return `${d}/${m}`
  }
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(s)) {
    const [d, m] = s.split('/')
    return `${d}/${m}`
  }
  return s || `P${idx + 1}`
}

export default function Dashboards() {
  const { user } = useAuth()
  const isAdmin = user?.global_admin === true || user?.is_admin === true || String(user?.role || '').toLowerCase() === 'admin'
  const indicatorsCacheRef = useRef(new Map())
  const relatorioCacheRef = useRef(new Map())

  const [regularAssets, setRegularAssets] = useState([])
  const [internalAssets, setInternalAssets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedDash, setSelectedDash] = useState(null)
  const [drillModal, setDrillModal] = useState(null)

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
  const [indCards, setIndCards] = useState(null)
  const [indPanelKey, setIndPanelKey] = useState(null)
  const [indLeitura, setIndLeitura] = useState(null)
  const [indWidgets, setIndWidgets] = useState(null)
  const [indPanelData, setIndPanelData] = useState(null)
  const [dashboardSemantic, setDashboardSemantic] = useState(null)
  const [allowedCharts, setAllowedCharts] = useState({})

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
    setIndCards(null)
    setIndPanelKey(null)
    setIndLeitura(null)
    setIndWidgets(null)
    setIndPanelData(null)
    setDashboardSemantic(null)
    setAllowedCharts({})
    setIndError(null)
    setIndRequestId(null)
    setIndStatusUrl(null)
    setIndStatus(null)
  }, [])

  const formatIndicatorValue = useCallback((value, format) => {
    const fmt = (format || 'number').toString()
    if (fmt === 'percent') {
      const n = Number(value)
      return Number.isFinite(n) ? `${n.toFixed(1)}%` : '—'
    }
    if (fmt === 'currency') {
      const n = Number(value)
      if (!Number.isFinite(n)) return '—'
      return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    }
    const n = Number(value)
    if (Number.isFinite(n)) return n.toLocaleString('pt-BR')
    if (value === null || value === undefined || value === '') return '—'
    return String(value)
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
    setIndCards(null)
    setIndPanelKey(null)
    setIndLeitura(null)
    setIndWidgets(null)
    setIndPanelData(null)
    setDashboardSemantic(null)
    setIndRequestId(null)
    setIndStatusUrl(null)

    try {
      const params = {}
      if (indFilters.data_inicio) params.data_inicio = indFilters.data_inicio
      if (indFilters.data_fim) params.data_fim = indFilters.data_fim
      if (indFilters.database) params.database = indFilters.database

      const cacheKey = JSON.stringify(params)
      const cached = indicatorsCacheRef.current.get(cacheKey)
      if (cached) {
        setIndicators(cached.indicators)
        setIndCards(cached.cards)
        setIndPanelKey(cached.panel_key)
        setIndLeitura(cached.leitura_executiva)
        setIndWidgets(cached.widgets)
        setIndPanelData(cached.panel_data)
        setDashboardSemantic(cached.semantic || null)
        setAllowedCharts(cached.permissions || {})
        setIndStatus('completed')
        setIndLoading(false)
        return
      }

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
      setIndCards(Array.isArray(res?.cards) ? res.cards : null)
      setIndPanelKey(res?.panel_key ? String(res.panel_key) : null)
      setIndLeitura(res?.leitura_executiva ? String(res.leitura_executiva) : null)
      setIndWidgets(Array.isArray(res?.widgets) ? res.widgets : null)
      setIndPanelData(res?.panel_data && typeof res.panel_data === 'object' ? res.panel_data : null)
      setDashboardSemantic(res?.semantic && typeof res.semantic === 'object' ? res.semantic : null)
      setAllowedCharts(res?.permissions && typeof res.permissions === 'object' ? res.permissions : {})
      indicatorsCacheRef.current.set(cacheKey, {
        indicators: inds,
        cards: Array.isArray(res?.cards) ? res.cards : null,
        panel_key: res?.panel_key ? String(res.panel_key) : null,
        leitura_executiva: res?.leitura_executiva ? String(res.leitura_executiva) : null,
        widgets: Array.isArray(res?.widgets) ? res.widgets : null,
        panel_data: res?.panel_data && typeof res.panel_data === 'object' ? res.panel_data : null,
        semantic: res?.semantic && typeof res.semantic === 'object' ? res.semantic : null,
        permissions: res?.permissions && typeof res.permissions === 'object' ? res.permissions : {},
      })
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
          setIndCards(Array.isArray(st?.data?.cards) ? st.data.cards : null)
          setIndPanelKey(st?.data?.panel_key ? String(st.data.panel_key) : null)
          setIndLeitura(st?.data?.leitura_executiva ? String(st.data.leitura_executiva) : null)
          setIndWidgets(Array.isArray(st?.data?.widgets) ? st.data.widgets : null)
          setIndPanelData(st?.data?.panel_data && typeof st.data.panel_data === 'object' ? st.data.panel_data : null)
          setDashboardSemantic(st?.data?.semantic && typeof st.data.semantic === 'object' ? st.data.semantic : null)
          setAllowedCharts(st?.data?.permissions && typeof st.data.permissions === 'object' ? st.data.permissions : {})
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
        const cacheKey = JSON.stringify({ database: 'azportoex', data_inicio: null, data_fim: null })
        const cached = relatorioCacheRef.current.get(cacheKey)
        if (cached) {
          setRelEntregasData(cached)
          setRelEntregasLoading(false)
          setRelEntregasStatus('completed')
          return
        }

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
              relatorioCacheRef.current.set(cacheKey, payload)
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
  const relEntregasAgents = useMemo(() => {
    const semanticRows = dashboardSemantic?.charts?.performanceMotoristas
    if (Array.isArray(semanticRows) && semanticRows.length > 0) {
      return semanticRows.map((r) => ({
        agente: r.agente || r.nome || '—',
        no_prazo: toNumber(r.noPrazo ?? r.no_prazo),
        fora_prazo: toNumber(r.foraPrazo ?? r.fora_prazo),
        sem_previsao: toNumber(r.semPrevisao ?? r.sem_previsao),
        total: toNumber(r.total),
      }))
    }
    return asArray(relEntregasData?.por_agente)
  }, [dashboardSemantic, relEntregasData])
  const relEntregasAggregated = useMemo(() => {
    const ag = relEntregasData?.agregado
    return {
      total: Number(ag?.total) || 0,
      no_prazo: Number(ag?.no_prazo) || 0,
      fora_prazo: Number(ag?.fora_prazo) || 0,
      sem_previsao: Number(ag?.sem_previsao) || 0,
    }
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

  const timelineRaw = useMemo(() => {
    const semanticRows = dashboardSemantic?.charts?.volumeMensal
    const rows = Array.isArray(semanticRows) && semanticRows.length > 0
      ? semanticRows
      : relEntregasData?.serie_diaria || relEntregasData?.por_dia || relEntregasData?.timeline
    return asArray(rows)
      .map((row, idx) => {
        if (!row || typeof row !== 'object') return null
        const date = row.data || row.dia || row.date || row.periodo || row.label || `P${idx + 1}`
        const total = toNumber(row.total || row.volume || row.qtd || row.quantidade)
        return { date: String(date), total }
      })
      .filter(Boolean)
  }, [dashboardSemantic, relEntregasData])

  const volumeMensalChart = useMemo(() => {
    if (!timelineRaw.length) return null
    return {
      id: 'volume-mensal',
      type: 'line',
      title: 'Evolução temporal de volume',
      labels: timelineRaw.map((r, idx) => normalizeDateLabel(r.date, idx)),
      datasets: [{ key: 'volume', label: 'Volume', data: timelineRaw.map((r) => r.total) }],
    }
  }, [timelineRaw])

  const trendAreaChart = useMemo(() => {
    if (!timelineRaw.length) return null
    let acc = 0
    const acumulado = timelineRaw.map((r) => {
      acc += r.total
      return acc
    })
    return {
      id: 'tendencia-acumulada',
      type: 'area',
      title: 'Tendência acumulada',
      labels: timelineRaw.map((r, idx) => normalizeDateLabel(r.date, idx)),
      datasets: [{ key: 'acumulado', label: 'Acumulado', data: acumulado }],
    }
  }, [timelineRaw])

  const serviceRows = useMemo(() => {
    const map = indPanelData?.resultado_por_servico_d5
    if (!map || typeof map !== 'object') return []
    return Object.entries(map)
      .map(([servico, item]) => ({
        servico,
        faturamento: toNumber(item?.faturamento),
        quantidade: toNumber(item?.quantidade),
      }))
      .sort((a, b) => b.faturamento - a.faturamento)
  }, [indPanelData])

  const serviceChart = useMemo(() => {
    if (!serviceRows.length) return null
    const top = serviceRows.slice(0, 8)
    return {
      id: 'resultado-servico',
      type: 'bar',
      title: 'Comparativo por serviço',
      labels: top.map((r) => r.servico),
      datasets: [{ key: 'faturamento', label: 'Faturamento', data: top.map((r) => r.faturamento) }],
    }
  }, [serviceRows])

  const statusChart = useMemo(() => {
    const semanticRows = dashboardSemantic?.charts?.operacoesPorStatus
    if (Array.isArray(semanticRows) && semanticRows.length > 0) {
      return {
        id: 'operacoes-status',
        type: 'donut',
        title: 'Distribuição por status',
        labels: semanticRows.map((r) => r.status || r.label || 'Status'),
        datasets: [{ key: 'status', label: 'Total', data: semanticRows.map((r) => toNumber(r.total ?? r.valor ?? r.value)) }],
      }
    }
    if (!relEntregasAggregated.total) return null
    return {
      id: 'operacoes-status',
      type: 'donut',
      title: 'Distribuição por status',
      labels: ['No Prazo', 'Fora do Prazo', 'Sem Previsão'],
      datasets: [
        {
          key: 'status',
          label: 'Entregas',
          data: [relEntregasAggregated.no_prazo, relEntregasAggregated.fora_prazo, relEntregasAggregated.sem_previsao],
        },
      ],
    }
  }, [dashboardSemantic, relEntregasAggregated])

  const stackedAgentChart = useMemo(() => {
    if (!relEntregasAgents.length) return null
    const rows = relEntregasAgents
      .map((r) => ({
        agente: r.agente || r.nome || '—',
        no_prazo: toNumber(r.no_prazo),
        fora_prazo: toNumber(r.fora_prazo),
        sem_previsao: toNumber(r.sem_previsao),
        total: toNumber(r.total),
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 8)
    return {
      id: 'composicao-agentes',
      type: 'stackedBar',
      title: 'Composição por agente',
      labels: rows.map((r) => r.agente),
      datasets: [
        { key: 'no_prazo', label: 'No Prazo', data: rows.map((r) => r.no_prazo) },
        { key: 'fora_prazo', label: 'Fora do Prazo', data: rows.map((r) => r.fora_prazo) },
        { key: 'sem_previsao', label: 'Sem Previsão', data: rows.map((r) => r.sem_previsao) },
      ],
    }
  }, [relEntregasAgents])

  const heatmapRows = useMemo(() => {
    if (!relEntregasAgents.length) return []
    return relEntregasAgents
      .map((r) => ({
        agente: r.agente || r.nome || '—',
        no_prazo: toNumber(r.no_prazo),
        fora_prazo: toNumber(r.fora_prazo),
        sem_previsao: toNumber(r.sem_previsao),
      }))
      .sort((a, b) => (b.no_prazo + b.fora_prazo + b.sem_previsao) - (a.no_prazo + a.fora_prazo + a.sem_previsao))
      .slice(0, 8)
  }, [relEntregasAgents])

  const semanticDashboard = useMemo(() => {
    const kpis = {
      totalFretes: toNumber(indicators?.totalFretes),
      fretesMes: toNumber(indicators?.fretesMes),
      performance: toNumber(indicators?.performance),
      economiaGerada: toNumber(indicators?.economiaGerada),
      entregasNoPrazo: toNumber(relEntregasAggregated.no_prazo),
      entregasForaPrazo: toNumber(relEntregasAggregated.fora_prazo),
      totalEntregas: toNumber(relEntregasAggregated.total),
    }
    return {
      ...(dashboardSemantic && typeof dashboardSemantic === 'object' ? dashboardSemantic : {}),
      kpis: dashboardSemantic?.kpis && typeof dashboardSemantic.kpis === 'object' ? dashboardSemantic.kpis : kpis,
      charts: dashboardSemantic?.charts && typeof dashboardSemantic.charts === 'object'
        ? dashboardSemantic.charts
        : {
            volumeMensal: timelineRaw.map((r) => ({ periodo: r.date, volume: r.total })),
            operacoesPorStatus: [
              { status: 'No Prazo', valor: relEntregasAggregated.no_prazo },
              { status: 'Fora do Prazo', valor: relEntregasAggregated.fora_prazo },
              { status: 'Sem Previsão', valor: relEntregasAggregated.sem_previsao },
            ],
            performanceMotoristas: relEntregasAgents.map((r) => ({
              agente: r.agente || r.nome || '—',
              noPrazo: toNumber(r.no_prazo),
              foraPrazo: toNumber(r.fora_prazo),
              semPrevisao: toNumber(r.sem_previsao),
              total: toNumber(r.total),
            })),
            resultadoPorServico: serviceRows,
          },
      filtros: {
        data_inicio: indFilters.data_inicio || null,
        data_fim: indFilters.data_fim || null,
        database: indFilters.database || null,
        ...(dashboardSemantic?.filtros && typeof dashboardSemantic.filtros === 'object' ? dashboardSemantic.filtros : {}),
      },
      permissions: {
        ...(dashboardSemantic?.permissions && typeof dashboardSemantic.permissions === 'object' ? dashboardSemantic.permissions : {}),
        ...allowedCharts,
      },
    }
  }, [allowedCharts, dashboardSemantic, indFilters, indicators, relEntregasAggregated, relEntregasAgents, timelineRaw, serviceRows])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.__GEROT_DASHBOARD_SEMANTIC__ = semanticDashboard
    }
  }, [semanticDashboard])

  const canView = useCallback(
    (key) => {
      if (isAdmin) return true
      return allowedCharts?.[key] !== false
    },
    [allowedCharts, isAdmin]
  )

  const drillFromChart = useCallback(
    (chartId, point) => {
      const label = point?.label || null
      if (!label) return

      if (chartId === 'operacoes-status') {
        const map = {
          'No Prazo': 'no_prazo',
          'Fora do Prazo': 'fora_prazo',
          'Sem Previsão': 'sem_previsao',
        }
        const key = map[label]
        const rows = relEntregasAgents
          .filter((r) => toNumber(r?.[key]) > 0)
          .map((r) => ({
            agente: r.agente || r.nome || '—',
            valor: toNumber(r?.[key]),
            total: toNumber(r?.total),
          }))
          .sort((a, b) => b.valor - a.valor)
        setDrillModal({
          title: `Drill-down: ${label}`,
          columns: ['agente', 'valor', 'total'],
          rows,
        })
        return
      }

      if (chartId === 'resultado-servico') {
        const rows = serviceRows.filter((r) => r.servico === label)
        setDrillModal({
          title: `Drill-down: ${label}`,
          columns: ['servico', 'faturamento', 'quantidade'],
          rows,
        })
        return
      }

      if (chartId === 'composicao-agentes') {
        const rows = relEntregasAgents
          .filter((r) => (r.agente || r.nome || '—') === label)
          .map((r) => ({
            agente: r.agente || r.nome || '—',
            no_prazo: toNumber(r.no_prazo),
            fora_prazo: toNumber(r.fora_prazo),
            sem_previsao: toNumber(r.sem_previsao),
            total: toNumber(r.total),
          }))
        setDrillModal({
          title: `Drill-down: ${label}`,
          columns: ['agente', 'no_prazo', 'fora_prazo', 'sem_previsao', 'total'],
          rows,
        })
        return
      }

      if (chartId === 'volume-mensal') {
        const idx = volumeMensalChart?.labels?.findIndex((x) => x === label)
        const row = idx >= 0 ? timelineRaw[idx] : null
        setDrillModal({
          title: `Drill-down: ${label}`,
          columns: ['date', 'total'],
          rows: row ? [row] : [],
        })
      }
    },
    [relEntregasAgents, serviceRows, timelineRaw, volumeMensalChart]
  )

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

  function IndicatorGauge({ widget }) {
    const min = Number(widget?.min)
    const max = Number(widget?.max)
    const raw = Number(widget?.value)
    const value = Number.isFinite(raw) ? raw : null
    const mn = Number.isFinite(min) ? min : 0
    const mx = Number.isFinite(max) && max > mn ? max : 100
    const pct = value === null ? 0 : ((value - mn) / (mx - mn)) * 100
    const clamped = Number.isFinite(pct) ? Math.max(0, Math.min(100, pct)) : 0

    const status = (widget?.status || '').toString().toLowerCase()
    const variant = status === 'red' ? 'danger' : status === 'green' ? 'success' : 'default'
    const title = widget?.title || widget?.key || 'Indicador'
    const subtitle = widget?.format === 'percent'
      ? `${formatIndicatorValue(value, 'percent')} (alvo ${mn}-${mx})`
      : `${formatIndicatorValue(value, widget?.format)} (alvo ${mn}-${mx})`

    return <GaugeCard title={title} percent={clamped} subtitle={subtitle} variant={variant} />
  }

  function IndicatorTable({ widget }) {
    const title = widget?.title || widget?.key || 'Tabela'
    const cols = Array.isArray(widget?.columns) ? widget.columns : []
    const rows = Array.isArray(widget?.rows) ? widget.rows : []

    if (!cols.length) return null

    return (
      <Card className="p-4">
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-sm font-semibold text-foreground">{title}</h4>
          <span className="text-xs text-muted-foreground">{rows.length} linha(s)</span>
        </div>
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-muted/30">
              <tr>
                {cols.map((c) => (
                  <th key={c.key} className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">
                    {c.label || c.key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, idx) => (
                <tr key={idx} className="border-b last:border-0">
                  {cols.map((c) => (
                    <td key={c.key} className="px-3 py-2 text-foreground">
                      {formatIndicatorValue(r?.[c.key], c.format)}
                    </td>
                  ))}
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td className="px-3 py-6 text-center text-muted-foreground" colSpan={cols.length}>
                    Sem dados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
        <div className="space-y-4">
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

          {(indPanelKey || indLeitura) && (
            <Card>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Painel</p>
                  <p className="text-sm font-medium text-foreground">{indPanelKey || '—'}</p>
                </div>
                {indLeitura && (
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Leitura executiva</p>
                    <p className="text-sm text-foreground">{indLeitura}</p>
                  </div>
                )}
              </div>
            </Card>
          )}

          {Array.isArray(indCards) && indCards.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {indCards.map((c, idx) => (
                <Card key={`${c.key || 'card'}-${idx}`} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground">{c.label || c.key}</p>
                      <p className="mt-1 text-xl font-bold text-foreground">{formatIndicatorValue(c.value, c.format)}</p>
                    </div>
                    <Badge variant={c.status === 'red' ? 'destructive' : c.status === 'green' ? 'success' : 'default'}>
                      {c.status || '—'}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {Array.isArray(indWidgets) && indWidgets.length > 0 && (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {indWidgets.map((w, idx) => {
                if (w?.type === 'gauge') {
                  return <IndicatorGauge key={`${w.key || 'gauge'}-${idx}`} widget={w} />
                }
                if (w?.type === 'table') {
                  return <IndicatorTable key={`${w.key || 'table'}-${idx}`} widget={w} />
                }
                return null
              })}
            </div>
          )}

          {(canView('operacoesPorStatus') || canView('volumeMensal') || canView('tendenciaAcumulada') || canView('resultadoPorServico') || canView('performanceMotoristas') || canView('composicaoAgentes')) && (
            <div className="space-y-4 rounded-2xl border border-border bg-card p-4 shadow-card">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Visão Executiva BI</h3>
                  <p className="text-xs text-muted-foreground">
                    Layout modernizado (Power BI style), com drill-down dinâmico e estrutura semântica para IA.
                  </p>
                </div>
                <Badge variant="outline">{isAdmin ? 'Admin global' : 'Perfil com restrições'}</Badge>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <KpiCard label="Entregas Totais" value={semanticDashboard.kpis.totalEntregas.toLocaleString('pt-BR')} />
                <KpiCard label="No Prazo" value={semanticDashboard.kpis.entregasNoPrazo.toLocaleString('pt-BR')} />
                <KpiCard label="Fora do Prazo" value={semanticDashboard.kpis.entregasForaPrazo.toLocaleString('pt-BR')} />
                <KpiCard label="Performance" value={`${semanticDashboard.kpis.performance.toFixed(1)}%`} />
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {canView('volumeMensal') && volumeMensalChart ? (
                  <ChartCard chart={volumeMensalChart} onPointClick={(point) => drillFromChart('volume-mensal', point)} />
                ) : null}
                {canView('resultadoPorServico') && serviceChart ? (
                  <ChartCard chart={serviceChart} onPointClick={(point) => drillFromChart('resultado-servico', point)} />
                ) : null}
                {canView('operacoesPorStatus') && statusChart ? (
                  <ChartCard chart={statusChart} onPointClick={(point) => drillFromChart('operacoes-status', point)} />
                ) : null}
                {canView('tendenciaAcumulada') && trendAreaChart ? (
                  <ChartCard chart={trendAreaChart} onPointClick={(point) => drillFromChart('tendencia-acumulada', point)} />
                ) : null}
                {canView('performanceMotoristas') && canView('composicaoAgentes') && stackedAgentChart ? (
                  <div className="lg:col-span-2">
                    <ChartCard chart={stackedAgentChart} onPointClick={(point) => drillFromChart('composicao-agentes', point)} />
                  </div>
                ) : null}
              </div>

              {canView('performanceMotoristas') && canView('heatmapAgentes') && heatmapRows.length > 0 ? (
                <Card className="p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <CardTitle className="text-base">Heatmap por Agente (Top 8)</CardTitle>
                    <span className="text-xs text-muted-foreground">No prazo / Fora / Sem previsão</span>
                  </div>
                  <div className="space-y-2">
                    {heatmapRows.map((row) => {
                      const max = Math.max(row.no_prazo, row.fora_prazo, row.sem_previsao, 1)
                      const tone = (v) => Math.max(0.12, Math.min(1, v / max))
                      return (
                        <div key={row.agente} className="grid grid-cols-[minmax(120px,1fr)_repeat(3,minmax(0,1fr))] gap-2">
                          <div className="truncate text-xs font-medium text-foreground">{row.agente}</div>
                          <button
                            className="rounded px-2 py-1 text-xs text-left text-foreground transition hover:opacity-80"
                            style={{ backgroundColor: `rgba(34,197,94,${tone(row.no_prazo)})` }}
                            onClick={() => drillFromChart('composicao-agentes', { label: row.agente })}
                          >
                            {row.no_prazo.toLocaleString('pt-BR')}
                          </button>
                          <button
                            className="rounded px-2 py-1 text-xs text-left text-foreground transition hover:opacity-80"
                            style={{ backgroundColor: `rgba(239,68,68,${tone(row.fora_prazo)})` }}
                            onClick={() => drillFromChart('composicao-agentes', { label: row.agente })}
                          >
                            {row.fora_prazo.toLocaleString('pt-BR')}
                          </button>
                          <button
                            className="rounded px-2 py-1 text-xs text-left text-foreground transition hover:opacity-80"
                            style={{ backgroundColor: `rgba(100,116,139,${tone(row.sem_previsao)})` }}
                            onClick={() => drillFromChart('composicao-agentes', { label: row.agente })}
                          >
                            {row.sem_previsao.toLocaleString('pt-BR')}
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </Card>
              ) : null}

              <Card className="p-4">
                <CardTitle className="text-base">JSON semântico (IA-ready)</CardTitle>
                <pre className="mt-3 max-h-56 overflow-auto rounded-lg bg-muted/40 p-3 text-xs text-foreground">
                  {JSON.stringify(semanticDashboard, null, 2)}
                </pre>
              </Card>
            </div>
          )}
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

      <Modal
        open={!!drillModal}
        onClose={() => setDrillModal(null)}
        title={drillModal?.title || 'Drill-down'}
        size="xl"
      >
        {drillModal?.rows?.length ? (
          <div className="max-h-[65vh] overflow-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40">
                <tr>
                  {drillModal.columns.map((col) => (
                    <th key={col} className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {drillModal.rows.map((row, idx) => (
                  <tr key={idx} className="border-t">
                    {drillModal.columns.map((col) => (
                      <td key={col} className="px-3 py-2 text-foreground">
                        {typeof row?.[col] === 'number' ? row[col].toLocaleString('pt-BR') : String(row?.[col] ?? '—')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Card className="border-dashed">
            <p className="text-sm text-muted-foreground">Sem linhas para este recorte.</p>
          </Card>
        )}
      </Modal>
    </div>
  )
}
