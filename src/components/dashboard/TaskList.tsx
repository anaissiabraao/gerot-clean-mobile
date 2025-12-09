import { CheckCircle2, Circle, Clock, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  title: string;
  sector: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "in-progress" | "completed";
  dueDate?: string;
}

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Revisar documentação de exportação",
    sector: "Comércio Exterior",
    priority: "high",
    status: "in-progress",
    dueDate: "Hoje",
  },
  {
    id: "2",
    title: "Atualizar relatório mensal",
    sector: "Financeiro",
    priority: "medium",
    status: "pending",
    dueDate: "Amanhã",
  },
  {
    id: "3",
    title: "Conferir inventário do armazém",
    sector: "Operacional",
    priority: "low",
    status: "completed",
  },
  {
    id: "4",
    title: "Reunião com equipe comercial",
    sector: "Comercial",
    priority: "medium",
    status: "pending",
    dueDate: "Hoje, 15:00",
  },
];

const statusIcons = {
  pending: Circle,
  "in-progress": Clock,
  completed: CheckCircle2,
};

const statusColors = {
  pending: "text-muted-foreground",
  "in-progress": "text-primary",
  completed: "text-green-500",
};

const priorityColors = {
  low: "bg-muted text-muted-foreground",
  medium: "bg-amber-500/10 text-amber-600",
  high: "bg-destructive/10 text-destructive",
};

export function TaskList() {
  return (
    <Card className="animate-slide-up">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-primary" />
          Tarefas Pendentes
        </CardTitle>
        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
          {mockTasks.filter((t) => t.status !== "completed").length} ativas
        </span>
      </CardHeader>
      <CardContent className="space-y-3">
        {mockTasks.map((task) => {
          const StatusIcon = statusIcons[task.status];
          return (
            <div
              key={task.id}
              className={cn(
                "flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50",
                task.status === "completed" && "opacity-60"
              )}
            >
              <StatusIcon
                className={cn("mt-0.5 h-5 w-5 shrink-0", statusColors[task.status])}
              />
              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    "text-sm font-medium text-foreground",
                    task.status === "completed" && "line-through"
                  )}
                >
                  {task.title}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {task.sector}
                  </span>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-medium",
                      priorityColors[task.priority]
                    )}
                  >
                    {task.priority === "high"
                      ? "Urgente"
                      : task.priority === "medium"
                      ? "Média"
                      : "Baixa"}
                  </span>
                </div>
              </div>
              {task.dueDate && (
                <span className="shrink-0 text-xs text-muted-foreground">
                  {task.dueDate}
                </span>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
