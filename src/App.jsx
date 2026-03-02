import { Routes, Route, Navigate } from 'react-router-dom'
import { useTheme } from './hooks/useTheme'
import { useAuth } from './context/useAuth'
import { MainLayout } from './components/layout/MainLayout'
import env from './config/env'
import Home from './pages/Home'
import Dashboards from './pages/Dashboards'
import Insights from './pages/Insights'
import Indicadores from './pages/Indicadores'
import Chat from './pages/Chat'
import Agenda from './pages/Agenda'
import Biblioteca from './pages/Biblioteca'
import Perfil from './pages/Perfil'
import Login from './pages/Login'
import Admin from './pages/Admin'

function RequireAuth({ user, children }) {
  if (!user) return <Navigate to="/login" replace />
  return children
}

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

  if (!user && env.redirectToBackendLogin && env.backendUrl) {
    const next = encodeURIComponent(window.location.origin + window.location.pathname + window.location.search)
    window.location.replace(`${env.backendUrl}/login?next=${next}`)
    return null
  }

  const useLocalLogin = !!env.apiBaseUrl && !env.redirectToBackendLogin

  return (
    <MainLayout themeCtx={themeCtx} user={user} onLogout={logout}>
      <Routes>
        <Route
          path="/login"
          element={useLocalLogin ? <Login /> : <Navigate to="/" replace />}
        />

        <Route
          path="/"
          element={
            env.apiBaseUrl ? (
              <RequireAuth user={user}>
                <Home />
              </RequireAuth>
            ) : (
              <Home />
            )
          }
        />
        <Route
          path="/dashboards"
          element={
            env.apiBaseUrl ? (
              <RequireAuth user={user}>
                <Dashboards />
              </RequireAuth>
            ) : (
              <Dashboards />
            )
          }
        />
        <Route
          path="/insights"
          element={
            env.apiBaseUrl ? (
              <RequireAuth user={user}>
                <Insights />
              </RequireAuth>
            ) : (
              <Insights />
            )
          }
        />
        <Route
          path="/indicadores"
          element={
            env.apiBaseUrl ? (
              <RequireAuth user={user}>
                <Indicadores />
              </RequireAuth>
            ) : (
              <Indicadores />
            )
          }
        />
        <Route
          path="/chat"
          element={
            env.apiBaseUrl ? (
              <RequireAuth user={user}>
                <Chat />
              </RequireAuth>
            ) : (
              <Chat />
            )
          }
        />
        <Route
          path="/agenda"
          element={
            env.apiBaseUrl ? (
              <RequireAuth user={user}>
                <Agenda />
              </RequireAuth>
            ) : (
              <Agenda />
            )
          }
        />
        <Route
          path="/biblioteca"
          element={
            env.apiBaseUrl ? (
              <RequireAuth user={user}>
                <Biblioteca />
              </RequireAuth>
            ) : (
              <Biblioteca />
            )
          }
        />
        <Route
          path="/perfil"
          element={
            env.apiBaseUrl ? (
              <RequireAuth user={user}>
                <Perfil />
              </RequireAuth>
            ) : (
              <Perfil />
            )
          }
        />

        <Route
          path="/admin"
          element={
            env.apiBaseUrl ? (
              <RequireAuth user={user}>
                <Admin />
              </RequireAuth>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MainLayout>
  )
}

export default App
