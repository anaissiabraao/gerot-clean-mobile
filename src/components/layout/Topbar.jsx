import { useLocation } from 'react-router-dom'
import { LogOut, Menu, Moon, Sun, User, PanelLeftClose, PanelLeftOpen } from 'lucide-react'

const pageTitles = {
  '/': 'Início',
  '/dashboards': 'Dashboards',
  '/indicadores': 'Indicadores Executivos',
  '/chat': 'Chat IA',
  '/agenda': 'Agenda CD',
  '/biblioteca': 'Biblioteca',
  '/perfil': 'Perfil',
  '/admin': 'Admin',
}

export function Topbar({ onMenuClick, onToggleSidebarCollapsed, sidebarCollapsed, themeCtx, user, onLogout }) {
  const location = useLocation()
  const title = pageTitles[location.pathname] || 'GeRot'

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-4 md:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:hidden"
          aria-label="Abrir menu"
        >
          <Menu size={20} />
        </button>

        {user && onToggleSidebarCollapsed ? (
          <button
            type="button"
            onClick={onToggleSidebarCollapsed}
            className="hidden rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:inline-flex"
            aria-label={sidebarCollapsed ? 'Expandir menu lateral' : 'Recolher menu lateral'}
            title={sidebarCollapsed ? 'Expandir menu lateral' : 'Recolher menu lateral'}
          >
            {sidebarCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
          </button>
        ) : null}
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={themeCtx.toggle}
          className="hidden rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground md:flex"
          aria-label="Alternar tema"
        >
          {themeCtx.isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        {user && onLogout ? (
          <button
            onClick={onLogout}
            className="hidden rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground md:flex"
            aria-label="Sair"
            type="button"
          >
            <LogOut size={18} />
          </button>
        ) : null}
        <span className="hidden text-sm text-muted-foreground md:inline">
          {user?.nome_completo || user?.username || 'Usuário'}
        </span>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
          <User size={16} />
        </div>
      </div>
    </header>
  )
}
