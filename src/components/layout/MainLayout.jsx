import { useState } from 'react'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

export function MainLayout({ children, themeCtx, user, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      return window.localStorage.getItem('gerot.sidebar.collapsed') === '1'
    } catch {
      return false
    }
  })

  const toggleCollapsed = () => {
    setSidebarCollapsed((prev) => {
      const next = !prev
      try {
        window.localStorage.setItem('gerot.sidebar.collapsed', next ? '1' : '0')
      } catch {
        // ignore
      }
      return next
    })
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        themeCtx={themeCtx}
        user={user}
        collapsed={sidebarCollapsed}
      />

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar
          onMenuClick={() => setSidebarOpen(true)}
          onToggleSidebarCollapsed={toggleCollapsed}
          sidebarCollapsed={sidebarCollapsed}
          themeCtx={themeCtx}
          user={user}
          onLogout={onLogout}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
