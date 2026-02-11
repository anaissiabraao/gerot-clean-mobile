import { NavLink, useLocation } from 'react-router-dom'
import {
  Home,
  LayoutDashboard,
  BarChart3,
  MessageSquare,
  Calendar,
  Library,
  User,
  LogOut,
  Moon,
  Sun,
  X,
} from 'lucide-react'
import env from '../../config/env'

const navItems = [
  { label: 'Início', path: '/', icon: Home },
  { label: 'Dashboards', path: '/dashboards', icon: LayoutDashboard },
  { label: 'Indicadores', path: '/indicadores', icon: BarChart3 },
  { label: 'Chat IA', path: '/chat', icon: MessageSquare },
  { label: 'Agenda CD', path: '/agenda', icon: Calendar },
  { label: 'Biblioteca', path: '/biblioteca', icon: Library },
]

export function Sidebar({ open, onClose, themeCtx }) {
  const location = useLocation()

  const linkClasses = (isActive) =>
    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-primary/15 text-primary'
        : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
    }`

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-sidebar transition-transform duration-300 lg:static lg:translate-x-0 ${
        open ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-sidebar-accent px-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
            G
          </div>
          <span className="text-lg font-bold text-sidebar-foreground">GeRot</span>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-sidebar-foreground lg:hidden"
        >
          <X size={18} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4 scrollbar-thin">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            onClick={onClose}
            className={({ isActive }) => linkClasses(isActive)}
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-accent p-3 space-y-1">
        <NavLink
          to="/perfil"
          onClick={onClose}
          className={({ isActive }) => linkClasses(isActive)}
        >
          <User size={18} />
          <span>Perfil</span>
        </NavLink>

        <button
          onClick={themeCtx.toggle}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
        >
          {themeCtx.isDark ? <Sun size={18} /> : <Moon size={18} />}
          <span>{themeCtx.isDark ? 'Modo claro' : 'Modo escuro'}</span>
        </button>

        {env.backendUrl && (
          <a
            href={`${env.backendUrl}/login`}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut size={18} />
            <span>Sair</span>
          </a>
        )}
      </div>
    </aside>
  )
}
