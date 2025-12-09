import { Plus, Calendar, FileText, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const actions = [
  { icon: Plus, label: "Nova Tarefa", color: "bg-primary text-primary-foreground" },
  { icon: Calendar, label: "Agendar", color: "bg-secondary text-secondary-foreground" },
  { icon: FileText, label: "Relatório", color: "bg-green-500/10 text-green-600" },
  { icon: Users, label: "Reunião", color: "bg-amber-500/10 text-amber-600" },
];

export function QuickActions() {
  return (
    <Card className="animate-slide-up">
      <CardHeader>
        <CardTitle>Ações Rápidas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {actions.map((action) => (
            <Button
              key={action.label}
              variant="outline"
              className="flex h-auto flex-col gap-2 py-4"
            >
              <div className={`rounded-lg p-2 ${action.color}`}>
                <action.icon className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium">{action.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
