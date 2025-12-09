import { ListTodo, Users, CheckCircle2, TrendingUp } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { TaskList } from "@/components/dashboard/TaskList";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { SectorProgress } from "@/components/dashboard/SectorProgress";

const stats = [
  {
    title: "Tarefas Hoje",
    value: 12,
    subtitle: "4 urgentes",
    icon: ListTodo,
    variant: "primary" as const,
  },
  {
    title: "Colaboradores Ativos",
    value: 48,
    subtitle: "De 52 totais",
    icon: Users,
    variant: "default" as const,
  },
  {
    title: "Concluídas na Semana",
    value: 87,
    subtitle: "+23% vs semana anterior",
    icon: CheckCircle2,
    variant: "success" as const,
    trend: { value: 23, label: "vs semana anterior" },
  },
  {
    title: "Produtividade",
    value: "94%",
    subtitle: "Meta: 90%",
    icon: TrendingUp,
    variant: "primary" as const,
    trend: { value: 4, label: "acima da meta" },
  },
];

export default function Index() {
  return (
    <div className="container py-4 md:py-6">
      {/* Welcome Section */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl font-bold text-foreground md:text-2xl lg:text-3xl">
          Bom dia, Abraão! 👋
        </h1>
        <p className="mt-1 text-sm text-muted-foreground md:text-base">
          Aqui está o resumo das atividades de hoje
        </p>
      </div>

      {/* Stats Grid */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div key={stat.title} style={{ animationDelay: `${index * 100}ms` }}>
            <StatsCard {...stat} />
          </div>
        ))}
      </div>

      {/* Quick Actions - Mobile friendly */}
      <div className="mb-6">
        <QuickActions />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <TaskList />
        <SectorProgress />
      </div>
    </div>
  );
}
