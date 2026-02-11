import {
  BarChart,
  Bar,
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

/**
 * Recebe chart no formato do backend: { id, type: 'bar'|'pie', title, labels, datasets: [{ label, data }] }
 * noTitle: quando true, não renderiza o título (uso embutido em outro card).
 */
export function ChartCard({ chart, className = '', noTitle = false }) {
  if (!chart || !chart.labels?.length) return null

  const { type = 'bar', title, labels, datasets } = chart
  const primaryDataset = datasets?.[0]
  const data =
    primaryDataset?.data?.length === labels.length
      ? labels.map((name, i) => ({
          name: String(name).length > 18 ? String(name).slice(0, 18) + '…' : name,
          value: Number(primaryDataset.data[i]) || 0,
          fullName: name,
        }))
      : []

  if (!data.length) return null

  return (
    <Card className={`overflow-hidden ${className}`}>
      {!noTitle && (
        <div className="px-4 pt-4 pb-1">
          <CardTitle className="text-base">{title || 'Gráfico'}</CardTitle>
        </div>
      )}
      <div className={`w-full px-2 pb-2 ${noTitle ? 'h-[200px]' : 'h-[260px]'}`}>
        {type === 'pie' ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [Number(value).toLocaleString('pt-BR'), primaryDataset?.label]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v)} />
              <Tooltip
                formatter={(value) => [Number(value).toLocaleString('pt-BR'), primaryDataset?.label]}
                contentStyle={{ borderRadius: 8, border: '1px solid hsl(var(--border))' }}
              />
              <Bar dataKey="value" fill={CHART_COLORS[0]} radius={[4, 4, 0, 0]} name={primaryDataset?.label} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  )
}
