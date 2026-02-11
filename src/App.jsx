import { useEffect } from 'react'
import './App.css'
import env from './config/env'

const BACKEND_LOGIN_PATHS = ['/', '/index.html', '/login']

function App() {
  useEffect(() => {
    if (!env.backendUrl) return
    const path = window.location.pathname.replace(/\/$/, '') || '/'
    if (BACKEND_LOGIN_PATHS.includes(path)) {
      window.location.replace(`${env.backendUrl}/login`)
      return
    }
  }, [])

  if (env.backendUrl) {
    const path = window.location.pathname.replace(/\/$/, '') || '/'
    if (BACKEND_LOGIN_PATHS.includes(path)) {
      return (
        <main className="app-shell" style={{ padding: '2rem', textAlign: 'center' }}>
          <p>Redirecionando para o login…</p>
        </main>
      )
    }
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <h1>GeRot Frontend</h1>
        <p>Backend não configurado (VITE_BACKEND_URL).</p>
      </header>
    </main>
  )
}

export default App
