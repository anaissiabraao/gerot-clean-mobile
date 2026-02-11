import { Routes, Route, Navigate } from 'react-router-dom'
import { useTheme } from './hooks/useTheme'
import { useAuth } from './context/AuthContext'
import { MainLayout } from './components/layout/MainLayout'
import Home from './pages/Home'
import Dashboards from './pages/Dashboards'
import Indicadores from './pages/Indicadores'
import Chat from './pages/Chat'
import Agenda from './pages/Agenda'
import Biblioteca from './pages/Biblioteca'
import Perfil from './pages/Perfil'

function App() {
  const themeCtx = useTheme()
  const { user, loading, logout } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <MainLayout themeCtx={themeCtx} user={user} onLogout={logout}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboards" element={<Dashboards />} />
        <Route path="/indicadores" element={<Indicadores />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/agenda" element={<Agenda />} />
        <Route path="/biblioteca" element={<Biblioteca />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MainLayout>
  )
}

export default App
