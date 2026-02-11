import { Routes, Route, Navigate } from 'react-router-dom'
import { useTheme } from './hooks/useTheme'
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

  return (
    <MainLayout themeCtx={themeCtx}>
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
