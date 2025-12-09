import { Home, ListTodo, BarChart3, Users, Settings, ChevronLeft, Building2, CalendarDays, FileText, Shield, Box } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import portoexLogo from "@/assets/portoex-logo.png";

const mainNavItems = [
  { icon: Home, label: "Dashboard", href: "/" },
  { icon: ListTodo, label: "Tarefas", href: "/tasks" },
  { icon: CalendarDays, label: "Agenda", href: "/calendar" },
  { icon: BarChart3, label: "Relatórios", href: "/reports" },
];

const secondaryNavItems = [
  { icon: Users, label: "Equipe", href: "/team" },
  { icon: Building2, label: "Setores", href: "/sectors" },
  { icon: FileText, label: "Documentos", href: "/documents" },
  { icon: Settings, label: "Configurações", href: "/settings" },
];

const adminNavItems = [
  { icon: Shield, label: "Painel Admin", href: "/admin" },
  { icon: Box, label: "Ambientes 3D", href: "/admin/environments" },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-64 bg-secondary text-secondary-foreground transition-transform duration-300 md:sticky md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
            <div className="flex items-center gap-3">
              <img src={portoexLogo} alt="PORTOEX" className="h-10 w-auto brightness-0 invert" />
              <div className="flex flex-col">
                <span className="text-lg font-bold">GeRot</span>
                <span className="text-xs text-sidebar-foreground/70">Gestão de Rotinas</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground md:hidden"
              onClick={onClose}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 scrollbar-thin">
            <div className="space-y-1">
              <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50">
                Principal
              </p>
              {mainNavItems.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/80 transition-colors",
                    "hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  )}
                  activeClassName="bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground"
                  onClick={onClose}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </NavLink>
              ))}
            </div>

            <div className="mt-6 space-y-1">
              <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50">
                Gestão
              </p>
              {secondaryNavItems.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/80 transition-colors",
                    "hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  )}
                  activeClassName="bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground"
                  onClick={onClose}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </NavLink>
              ))}
            </div>

            <div className="mt-6 space-y-1">
              <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50">
                Administração
              </p>
              {adminNavItems.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/80 transition-colors",
                    "hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  )}
                  activeClassName="bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground"
                  onClick={onClose}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </NavLink>
              ))}
            </div>
          </nav>

          {/* Footer */}
          <div className="border-t border-sidebar-border p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 overflow-hidden rounded-full bg-sidebar-primary">
                <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-sidebar-primary-foreground">
                  AA
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium">Abraão Anaissi</p>
                <p className="truncate text-xs text-sidebar-foreground/70">Administrador</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
