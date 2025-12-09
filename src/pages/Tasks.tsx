import { useState } from "react";
import { Plus, Filter, Search, CheckCircle2, Circle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  title: string;
  description: string;
  sector: string;
  assignee: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "in-progress" | "completed";
  dueDate: string;
}

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Revisar documentação de exportação",
    description: "Verificar todos os documentos necessários para o embarque",
    sector: "Comércio Exterior",
    assignee: "Maria Silva",
    priority: "high",
    status: "in-progress",
    dueDate: "2024-12-09",
  },
  {
    id: "2",
    title: "Atualizar relatório mensal",
    description: "Consolidar dados financeiros do mês",
    sector: "Financeiro",
    assignee: "João Santos",
    priority: "medium",
    status: "pending",
    dueDate: "2024-12-10",
  },
  {
    id: "3",
    title: "Conferir inventário do armazém",
    description: "Contagem física do estoque",
    sector: "Operacional",
    assignee: "Carlos Oliveira",
    priority: "low",
    status: "completed",
    dueDate: "2024-12-08",
  },
  {
    id: "4",
    title: "Reunião com equipe comercial",
    description: "Alinhamento de metas do trimestre",
    sector: "Comercial",
    assignee: "Ana Costa",
    priority: "medium",
    status: "pending",
    dueDate: "2024-12-09",
  },
  {
    id: "5",
    title: "Atualização do sistema de segurança",
    description: "Implementar novas regras de acesso",
    sector: "TI",
    assignee: "Pedro Alves",
    priority: "high",
    status: "in-progress",
    dueDate: "2024-12-11",
  },
];

const statusConfig = {
  pending: { icon: Circle, label: "Pendente", color: "text-muted-foreground bg-muted" },
  "in-progress": { icon: Clock, label: "Em andamento", color: "text-primary bg-primary/10" },
  completed: { icon: CheckCircle2, label: "Concluída", color: "text-green-600 bg-green-500/10" },
};

const priorityConfig = {
  low: { label: "Baixa", color: "bg-muted text-muted-foreground" },
  medium: { label: "Média", color: "bg-amber-500/10 text-amber-600" },
  high: { label: "Urgente", color: "bg-destructive/10 text-destructive" },
};

type FilterStatus = "all" | "pending" | "in-progress" | "completed";

export default function Tasks() {
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTasks = mockTasks.filter((task) => {
    const matchesFilter = filter === "all" || task.status === filter;
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.sector.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const statusCounts = {
    all: mockTasks.length,
    pending: mockTasks.filter((t) => t.status === "pending").length,
    "in-progress": mockTasks.filter((t) => t.status === "in-progress").length,
    completed: mockTasks.filter((t) => t.status === "completed").length,
  };

  return (
    <div className="container py-4 md:py-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground md:text-2xl">Tarefas</h1>
          <p className="text-sm text-muted-foreground">Gerencie suas atividades</p>
        </div>
        <Button variant="hero" className="w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          Nova Tarefa
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar tarefas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="sm:w-auto">
          <Filter className="h-4 w-4" />
          Filtros
        </Button>
      </div>

      {/* Status Tabs */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
        {(["all", "pending", "in-progress", "completed"] as FilterStatus[]).map((status) => (
          <Button
            key={status}
            variant={filter === status ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(status)}
            className="shrink-0"
          >
            {status === "all"
              ? "Todas"
              : status === "pending"
              ? "Pendentes"
              : status === "in-progress"
              ? "Em andamento"
              : "Concluídas"}
            <span className="ml-1.5 rounded-full bg-current/10 px-1.5 py-0.5 text-xs">
              {statusCounts[status]}
            </span>
          </Button>
        ))}
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.map((task) => {
          const StatusIcon = statusConfig[task.status].icon;
          return (
            <Card key={task.id} variant="interactive" className="animate-fade-in">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <StatusIcon
                    className={cn(
                      "mt-1 h-5 w-5 shrink-0",
                      statusConfig[task.status].color.split(" ")[0]
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h3 className="font-medium text-foreground">{task.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                          {task.description}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium",
                          priorityConfig[task.priority].color
                        )}
                      >
                        {priorityConfig[task.priority].label}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span>{task.sector}</span>
                      <span>•</span>
                      <span>{task.assignee}</span>
                      <span>•</span>
                      <span>{new Date(task.dueDate).toLocaleDateString("pt-BR")}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredTasks.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Nenhuma tarefa encontrada</p>
        </Card>
      )}
    </div>
  );
}
