import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import { Card, CardTitle } from './Card'

const CHART_COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--chart-2, 220 47% 35%))',
  'hsl(var(--chart-3, 142 71% 45%))',
  'hsl(var(--chart-4, 38 92% 50%))',
  'hsl(var(--chart-5, 217 91% 60%))',
]

function normalizeDatasets(labels, datasets) {
  if (!Array.isArray(datasets)) return []
  return datasets
    .filter((ds) => ds && Array.isArray(ds.data))
    .map((ds, idx) => ({
      key: ds.key || `series_${idx}`,
      label: ds.label || `Série ${idx + 1}`,
      data: labels.map((_, i) => Number(ds.data[i]) || 0),
      stack: ds.stack || null,
    }))
}

/**
 * Recebe chart no formato:
 * {
 *   id,
 *   type: 'bar'|'pie'|'line'|'area'|'stackedBar'|'donut',
 *   title,
 *   labels,
 *   datasets: [{ key?, label, data, stack? }]
 * }
 */
export function ChartCard({ chart, className = '', noTitle = false, onPointClick = null }) {
  if (!chart || !chart.labels?.length) return null

  const { type = 'bar', title, labels, datasets } = chart
  const chartType = String(type).toLowerCase()
  const normalized = normalizeDatasets(labels, datasets)
  const primaryDataset = normalized[0]
  const data = labels.map((name, i) => {
    const row = {
      name: String(name).length > 18 ? String(name).slice(0, 18) + '…' : String(name),
      fullName: String(name),
    }
    normalized.forEach((ds) => {
      row[ds.key] = Number(ds.data[i]) || 0
    })
    return row
  })

  if (!data.length || !normalized.length) return null

  const emitPointClick = (payload) => {
    if (typeof onPointClick !== 'function') return
    onPointClick(payload)
  }

  const tooltipFormatter = (value, name) => [Number(value).toLocaleString('pt-BR'), name]

  return (
    <Card className={`overflow-hidden ${className}`}>
      {!noTitle && (
        <div className="px-4 pt-4 pb-1">
          <CardTitle className="text-base">{title || 'Gráfico'}</CardTitle>
        </div>
      )}
      <div className={`w-full px-2 pb-2 ${noTitle ? 'h-[200px]' : 'h-[260px]'}`}>
        {chartType === 'pie' || chartType === 'donut' ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey={primaryDataset.key}
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={chartType === 'donut' ? 50 : 28}
                outerRadius={80}
                paddingAngle={2}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                onClick={(entry, index) => {
                  emitPointClick({
                    chartId: chart.id || title || 'chart',
                    chartTitle: title || 'Gráfico',
                    label: entry?.payload?.fullName || entry?.name,
                    value: Number(entry?.value) || 0,
                    seriesKey: primaryDataset.key,
                    seriesLabel: primaryDataset.label,
                    index,
                    row: entry?.payload || null,
                  })
                }}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={tooltipFormatter} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : chartType === 'line' ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v)} />
              <Tooltip formatter={tooltipFormatter} />
              {normalized.map((ds, idx) => (
                <Line
                  key={ds.key}
                  type="monotone"
                  dataKey={ds.key}
                  stroke={CHART_COLORS[idx % CHART_COLORS.length]}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                  name={ds.label}
                  onClick={(entry, index) => {
                    emitPointClick({
                      chartId: chart.id || title || 'chart',
                      chartTitle: title || 'Gráfico',
                      label: entry?.payload?.fullName || entry?.name,
                      value: Number(entry?.value) || 0,
                      seriesKey: ds.key,
                      seriesLabel: ds.label,
                      index,
                      row: entry?.payload || null,
                    })
                  }}
                />
              ))}
              <Legend />
            </LineChart>
          </ResponsiveContainer>
        ) : chartType === 'area' ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v)} />
              <Tooltip formatter={tooltipFormatter} />
              {normalized.map((ds, idx) => (
                <Area
                  key={ds.key}
                  type="monotone"
                  dataKey={ds.key}
                  stroke={CHART_COLORS[idx % CHART_COLORS.length]}
                  fill={CHART_COLORS[idx % CHART_COLORS.length]}
                  fillOpacity={0.2}
                  strokeWidth={2}
                  name={ds.label}
                  onClick={(entry, index) => {
                    emitPointClick({
                      chartId: chart.id || title || 'chart',
                      chartTitle: title || 'Gráfico',
                      label: entry?.payload?.fullName || entry?.name,
                      value: Number(entry?.value) || 0,
                      seriesKey: ds.key,
                      seriesLabel: ds.label,
                      index,
                      row: entry?.payload || null,
                    })
                  }}
                />
              ))}
              <Legend />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v)} />
              <Tooltip
                formatter={tooltipFormatter}
                contentStyle={{ borderRadius: 8, border: '1px solid hsl(var(--border))' }}
              />
              {normalized.map((ds, idx) => (
                <Bar
                  key={ds.key}
                  dataKey={ds.key}
                  fill={CHART_COLORS[idx % CHART_COLORS.length]}
                  radius={[4, 4, 0, 0]}
                  name={ds.label}
                  stackId={chartType === 'stackedbar' || chartType === 'stacked-bar' ? 'total' : ds.stack || undefined}
                  onClick={(entry, index) => {
                    emitPointClick({
                      chartId: chart.id || title || 'chart',
                      chartTitle: title || 'Gráfico',
                      label: entry?.payload?.fullName || entry?.name,
                      value: Number(entry?.value) || 0,
                      seriesKey: ds.key,
                      seriesLabel: ds.label,
                      index,
                      row: entry?.payload || null,
                    })
                  }}
                />
              ))}
              {normalized.length > 1 ? <Legend /> : null}
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  )
}
