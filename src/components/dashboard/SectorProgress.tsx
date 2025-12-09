import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Building2 } from "lucide-react";

interface Sector {
  name: string;
  progress: number;
  tasks: { completed: number; total: number };
}

const sectors: Sector[] = [
  { name: "Administrativo", progress: 85, tasks: { completed: 17, total: 20 } },
  { name: "Comercial", progress: 72, tasks: { completed: 18, total: 25 } },
  { name: "Operacional", progress: 60, tasks: { completed: 12, total: 20 } },
  { name: "Financeiro", progress: 90, tasks: { completed: 9, total: 10 } },
  { name: "TI", progress: 45, tasks: { completed: 9, total: 20 } },
];

export function SectorProgress() {
  return (
    <Card className="animate-slide-up">
      <CardHeader className="flex flex-row items-center gap-2">
        <Building2 className="h-5 w-5 text-primary" />
        <CardTitle>Progresso por Setor</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sectors.map((sector) => (
          <div key={sector.name} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{sector.name}</span>
              <span className="text-muted-foreground">
                {sector.tasks.completed}/{sector.tasks.total} tarefas
              </span>
            </div>
            <Progress value={sector.progress} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
