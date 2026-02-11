import { Link } from 'react-router-dom'
import { LayoutDashboard, BarChart3, MessageSquare, Calendar, Activity, Users, FileText, Zap } from 'lucide-react'
import { KpiCard } from '../components/ui/KpiCard'
import { Card } from '../components/ui/Card'

const quickLinks = [
  { label: 'Dashboards', description: 'Painéis e relatórios visuais', path: '/dashboards', icon: LayoutDashboard, color: 'bg-primary/10 text-primary' },
  { label: 'Indicadores', description: 'KPIs e métricas executivas', path: '/indicadores', icon: BarChart3, color: 'bg-success/10 text-success' },
  { label: 'Chat IA', description: 'Assistente de análise inteligente', path: '/chat', icon: MessageSquare, color: 'bg-secondary/10 text-secondary' },
  { label: 'Agenda CD', description: 'Agendamentos e reservas', path: '/agenda', icon: Calendar, color: 'bg-warning/10 text-warning' },
]

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Bem-vindo ao GeRot</h2>
        <p className="mt-1 text-muted-foreground">
          Painel de gestão de rotinas e análise de dados — PORTOEX
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="stagger-child">
          <KpiCard label="Dashboards" value="—" icon={LayoutDashboard} />
        </div>
        <div className="stagger-child">
          <KpiCard label="Indicadores" value="—" icon={BarChart3} />
        </div>
        <div className="stagger-child">
          <KpiCard label="Conversas IA" value="—" icon={MessageSquare} />
        </div>
        <div className="stagger-child">
          <KpiCard label="Agendamentos" value="—" icon={Calendar} />
        </div>
      </div>

      {/* Quick Links */}
      <div>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Acesso rápido
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map((item) => (
            <Link key={item.path} to={item.path} className="group">
              <Card hover className="h-full">
                <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl ${item.color}`}>
                  <item.icon size={20} />
                </div>
                <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                  {item.label}
                </h4>
                <p className="mt-0.5 text-xs text-muted-foreground">{item.description}</p>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Status */}
      <Card className="border-dashed">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10">
            <Activity size={20} className="text-success" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Status do Sistema</p>
            <p className="text-xs text-muted-foreground">
              Conectado ao backend via API. Dados serão carregados conforme os endpoints estiverem disponíveis.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
