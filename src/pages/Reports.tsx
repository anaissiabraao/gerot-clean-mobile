import { Download, Calendar, TrendingUp, Users, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const weeklyData = [
  { day: "Seg", tasks: 15, completed: 12 },
  { day: "Ter", tasks: 18, completed: 16 },
  { day: "Qua", tasks: 12, completed: 10 },
  { day: "Qui", tasks: 20, completed: 18 },
  { day: "Sex", tasks: 14, completed: 14 },
];

const sectorStats = [
  { name: "Comércio Exterior", tasks: 45, completed: 38, efficiency: 84 },
  { name: "Financeiro", tasks: 32, completed: 30, efficiency: 94 },
  { name: "Operacional", tasks: 58, completed: 48, efficiency: 83 },
  { name: "Comercial", tasks: 28, completed: 25, efficiency: 89 },
  { name: "TI", tasks: 35, completed: 28, efficiency: 80 },
];

export default function Reports() {
  return (
    <div className="container py-4 md:py-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground md:text-2xl">Relatórios</h1>
          <p className="text-sm text-muted-foreground">Análise de desempenho semanal</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4" />
            Esta semana
          </Button>
          <Button variant="hero" size="sm">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="animate-fade-in">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">169</p>
                <p className="text-xs text-muted-foreground">Tarefas concluídas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="animate-fade-in" style={{ animationDelay: "100ms" }}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-amber-500/10 p-2">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">29</p>
                <p className="text-xs text-muted-foreground">Em andamento</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="animate-fade-in" style={{ animationDelay: "200ms" }}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-500/10 p-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">86%</p>
                <p className="text-xs text-muted-foreground">Taxa de conclusão</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="animate-fade-in" style={{ animationDelay: "300ms" }}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-secondary/10 p-2">
                <Users className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold">48</p>
                <p className="text-xs text-muted-foreground">Colaboradores ativos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Weekly Chart */}
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle>Desempenho Semanal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between gap-2 h-48">
              {weeklyData.map((day) => (
                <div key={day.day} className="flex flex-1 flex-col items-center gap-2">
                  <div className="relative w-full flex flex-col items-center">
                    <div
                      className="w-8 rounded-t bg-muted"
                      style={{ height: `${(day.tasks / 20) * 100}px` }}
                    />
                    <div
                      className="absolute bottom-0 w-8 rounded-t bg-primary"
                      style={{ height: `${(day.completed / 20) * 100}px` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">{day.day}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-center gap-6 text-xs">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-muted" />
                <span className="text-muted-foreground">Total</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-primary" />
                <span className="text-muted-foreground">Concluídas</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sector Performance */}
        <Card className="animate-slide-up" style={{ animationDelay: "100ms" }}>
          <CardHeader>
            <CardTitle>Eficiência por Setor</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {sectorStats.map((sector) => (
              <div key={sector.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{sector.name}</span>
                  <span className="text-muted-foreground">
                    {sector.completed}/{sector.tasks} ({sector.efficiency}%)
                  </span>
                </div>
                <Progress value={sector.efficiency} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
