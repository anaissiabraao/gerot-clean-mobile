import { useState } from "react";
import { 
  Users, CheckCircle2, Clock, TrendingUp, FileText, 
  Download, Settings, Shield, Database, Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

const stats = [
  { label: "Usuários Ativos", value: "48", hint: "de 52 totais", icon: Users, color: "text-primary" },
  { label: "Tarefas Hoje", value: "156", hint: "+12 vs ontem", icon: CheckCircle2, color: "text-green-500" },
  { label: "Em Andamento", value: "32", hint: "8 urgentes", icon: Clock, color: "text-amber-500" },
  { label: "Produtividade", value: "94%", hint: "Meta: 90%", icon: TrendingUp, color: "text-primary" },
];

const dashboards = [
  { id: "team", name: "Dashboard Equipe", sector: "Geral", active: true },
  { id: "commercial", name: "Dashboard Comercial", sector: "Comercial", active: true },
  { id: "operations", name: "Dashboard Operações", sector: "Operacional", active: false },
  { id: "financial", name: "Dashboard Financeiro", sector: "Financeiro", active: true },
  { id: "export", name: "Dashboard Comércio Ext.", sector: "Comex", active: true },
  { id: "it", name: "Dashboard TI", sector: "TI", active: false },
];

const recentLogs = [
  { action: "Login", user: "Maria Silva", time: "Há 5 min", type: "info" },
  { action: "Tarefa concluída", user: "João Santos", time: "Há 12 min", type: "success" },
  { action: "Novo usuário", user: "Admin", time: "Há 1 hora", type: "info" },
  { action: "Backup realizado", user: "Sistema", time: "Há 2 horas", type: "success" },
  { action: "Erro de sincronização", user: "Sistema", time: "Há 3 horas", type: "error" },
];

const logTypeColors = {
  info: "bg-primary/10 text-primary",
  success: "bg-green-500/10 text-green-500",
  error: "bg-destructive/10 text-destructive",
};

export default function AdminDashboard() {
  const [selectedSector, setSelectedSector] = useState("all");

  return (
    <div className="container py-4 md:py-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground md:text-2xl">
            Painel Administrativo
          </h1>
          <p className="text-sm text-muted-foreground">
            Controle total do sistema GeRot
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Database className="h-4 w-4" />
            Backup
          </Button>
          <Button variant="hero" size="sm">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card 
            key={stat.label} 
            variant="interactive" 
            className="animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="mt-1 text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.hint}</p>
                </div>
                <div className={`rounded-xl bg-muted p-2.5 ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Dashboards Section */}
        <div className="lg:col-span-2">
          <Card className="animate-slide-up">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Dashboards Ativos
              </CardTitle>
              <Select value={selectedSector} onValueChange={setSelectedSector}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filtrar setor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos setores</SelectItem>
                  <SelectItem value="commercial">Comercial</SelectItem>
                  <SelectItem value="operations">Operacional</SelectItem>
                  <SelectItem value="financial">Financeiro</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                {dashboards.map((dash) => (
                  <div
                    key={dash.id}
                    className={`flex items-center justify-between rounded-xl border p-4 transition-colors ${
                      dash.active
                        ? "border-primary/30 bg-primary/5"
                        : "border-border bg-muted/50"
                    }`}
                  >
                    <div>
                      <h4 className="font-medium">{dash.name}</h4>
                      <span className="text-xs text-muted-foreground">
                        {dash.sector}
                      </span>
                    </div>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        dash.active
                          ? "bg-green-500/10 text-green-500"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {dash.active ? "Ativo" : "Inativo"}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Logs Section */}
        <div>
          <Card className="animate-slide-up" style={{ animationDelay: "100ms" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Logs Recentes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentLogs.map((log, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg bg-muted/50 p-3"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        log.type === "success"
                          ? "bg-green-500"
                          : log.type === "error"
                          ? "bg-destructive"
                          : "bg-primary"
                      }`}
                    />
                    <div>
                      <p className="text-sm font-medium">{log.action}</p>
                      <p className="text-xs text-muted-foreground">{log.user}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{log.time}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6">
        <Card className="animate-slide-up" style={{ animationDelay: "200ms" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Ações Administrativas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Button variant="outline" className="h-auto flex-col gap-2 py-4">
                <Users className="h-6 w-6 text-primary" />
                <span>Gerenciar Usuários</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col gap-2 py-4">
                <Shield className="h-6 w-6 text-green-500" />
                <span>Permissões</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col gap-2 py-4">
                <Database className="h-6 w-6 text-amber-500" />
                <span>Banco de Dados</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col gap-2 py-4">
                <FileText className="h-6 w-6 text-secondary" />
                <span>Relatórios</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
