import { NavLink } from 'react-router-dom'
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
  Settings,
  TrendingUp,
} from 'lucide-react'
import env from '../../config/env'
import { useAuth } from '../../context/useAuth'

const navItems = [
  { label: 'Início', path: '/', icon: Home },
  { label: 'Dashboards', path: '/dashboards', icon: LayoutDashboard },
  { label: 'Insights', path: '/insights', icon: TrendingUp },
  { label: 'Indicadores', path: '/indicadores', icon: BarChart3 },
  { label: 'Chat IA', path: '/chat', icon: MessageSquare },
  { label: 'Agenda CD', path: '/agenda', icon: Calendar },
  { label: 'Biblioteca', path: '/biblioteca', icon: Library },
]

export function Sidebar({ open, onClose, themeCtx, user, collapsed = false }) {
  const { logout } = useAuth()
  const isAdmin = user?.role === 'admin'

  const linkClasses = (isActive) =>
    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-primary/15 text-primary'
        : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
    }`

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-sidebar transition-transform duration-300 lg:static lg:translate-x-0 lg:${collapsed ? 'w-20' : 'w-64'} ${
        open ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Header */}
      <div className={`flex h-16 items-center justify-between border-b border-sidebar-accent ${collapsed ? 'px-3' : 'px-5'}`}>
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
            G
          </div>
          <span className={`text-lg font-bold text-sidebar-foreground ${collapsed ? 'hidden' : 'inline'}`}>GeRot</span>
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
            className={({ isActive }) => `${linkClasses(isActive)} ${collapsed ? 'justify-center px-2' : ''}`}
            title={collapsed ? item.label : undefined}
          >
            <item.icon size={18} />
            <span className={collapsed ? 'hidden' : 'inline'}>{item.label}</span>
          </NavLink>
        ))}
        {isAdmin && (
          <>
            <div className="my-2 border-t border-sidebar-accent" />
            <NavLink
              to="/admin"
              onClick={onClose}
              className={({ isActive }) => `${linkClasses(isActive)} ${collapsed ? 'justify-center px-2' : ''}`}
              title={collapsed ? 'Admin' : undefined}
            >
              <Settings size={18} />
              <span className={collapsed ? 'hidden' : 'inline'}>Admin</span>
            </NavLink>
          </>
        )}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-accent p-3 space-y-1">
        <NavLink
          to="/perfil"
          onClick={onClose}
          className={({ isActive }) => `${linkClasses(isActive)} ${collapsed ? 'justify-center px-2' : ''}`}
          title={collapsed ? 'Perfil' : undefined}
        >
          <User size={18} />
          <span className={collapsed ? 'hidden' : 'inline'}>Perfil</span>
        </NavLink>

        <button
          onClick={themeCtx.toggle}
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground ${collapsed ? 'justify-center px-2' : ''}`}
          title={collapsed ? (themeCtx.isDark ? 'Modo claro' : 'Modo escuro') : undefined}
        >
          {themeCtx.isDark ? <Sun size={18} /> : <Moon size={18} />}
          <span className={collapsed ? 'hidden' : 'inline'}>{themeCtx.isDark ? 'Modo claro' : 'Modo escuro'}</span>
        </button>

        {env.backendUrl && (
          <button
            type="button"
            onClick={logout}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-destructive/10 hover:text-destructive ${collapsed ? 'justify-center px-2' : ''}`}
            title={collapsed ? 'Sair' : undefined}
          >
            <LogOut size={18} />
            <span className={collapsed ? 'hidden' : 'inline'}>Sair</span>
          </button>
        )}
      </div>
    </aside>
  )
}
