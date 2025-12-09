import { Home, ListTodo, BarChart3, Users, Settings } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Início", href: "/" },
  { icon: ListTodo, label: "Tarefas", href: "/tasks" },
  { icon: BarChart3, label: "Relatórios", href: "/reports" },
  { icon: Users, label: "Equipe", href: "/team" },
  { icon: Settings, label: "Config", href: "/settings" },
];

export function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-lg safe-bottom md:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={cn(
              "flex flex-col items-center gap-1 px-3 py-2 text-muted-foreground transition-colors",
              "touch-action-manipulation active:scale-95"
            )}
            activeClassName="text-primary"
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
