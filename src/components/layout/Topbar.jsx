import { useLocation } from 'react-router-dom'
import { Menu, Moon, Sun, User } from 'lucide-react'

const pageTitles = {
  '/': 'Início',
  '/dashboards': 'Dashboards',
  '/indicadores': 'Indicadores Executivos',
  '/chat': 'Chat IA',
  '/agenda': 'Agenda CD',
  '/biblioteca': 'Biblioteca',
  '/perfil': 'Perfil',
}

export function Topbar({ onMenuClick, themeCtx, user }) {
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
