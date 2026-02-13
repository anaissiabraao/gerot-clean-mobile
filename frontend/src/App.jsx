import { useEffect, useState } from 'react'
import './App.css'
import env from './config/env'
import { BackendStatusCard } from './modules/health/components/BackendStatusCard'

function App() {
  const [authChecked, setAuthChecked] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    let canceled = false

    async function run() {
      try {
        if (!env.backendUrl) {
          setAuthChecked(true)
          return
        }

        const params = new URLSearchParams(window.location.search)
        if (params.get('noRedirect') === '1') {
          setAuthChecked(true)
          return
        }

        const backendOrigin = new URL(env.backendUrl).origin
        if (window.location.origin === backendOrigin) {
          setAuthChecked(true)
          return
        }

        const apiBase = env.apiBaseUrl || env.backendUrl

        if (env.forceLogin) {
          try {
            await fetch(`${apiBase}/logout`, {
              method: 'POST',
              credentials: 'include',
            })
          } catch {
            // ignore
          }

          setIsAuthenticated(false)
          setAuthChecked(true)
          const next = encodeURIComponent(window.location.origin + window.location.pathname + window.location.search)
          window.location.replace(`${env.backendUrl}/login?next=${next}`)
          return
        }

        const resp = await fetch(`${apiBase}/api/me`, {
          method: 'GET',
          credentials: 'include',
          headers: { Accept: 'application/json' },
        })

        if (canceled) return

        if (resp.ok) {
          setIsAuthenticated(true)
          setAuthChecked(true)
          return
        }

        setIsAuthenticated(false)
        setAuthChecked(true)

        if (env.redirectToBackendLogin) {
          const next = encodeURIComponent(window.location.origin + window.location.pathname + window.location.search)
          window.location.replace(`${env.backendUrl}/login?next=${next}`)
        }
      } catch {
        if (canceled) return
        setIsAuthenticated(false)
        setAuthChecked(true)
        if (env.redirectToBackendLogin && env.backendUrl) {
          const next = encodeURIComponent(window.location.origin + window.location.pathname + window.location.search)
          window.location.replace(`${env.backendUrl}/login?next=${next}`)
        }
      }
    }

    run()

    return () => {
      canceled = true
    }
  }, [])

  async function handleLogout() {
    if (!env.backendUrl) {
      return
    }

    try {
      const apiBase = env.apiBaseUrl || env.backendUrl
      await fetch(`${apiBase}/logout`, {
        method: 'POST',
        credentials: 'include',
      })
    } finally {
      window.location.replace(`${env.backendUrl}/login`)
    }
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <h1>GeRot Frontend - Vite + React</h1>
        {authChecked && isAuthenticated && env.backendUrl ? (
          <div style={{ marginTop: 8 }}>
            <button type="button" onClick={handleLogout}>
              Sair
            </button>
          </div>
        ) : null}
        <p>
          Base modular para integrar com Lovable e orquestrar consumo de backend
          poliglota.
        </p>
      </header>

      <section className="cards-grid">
        <BackendStatusCard />
      </section>

      <div className="next-steps">
        <h2>Atalhos legados</h2>
        <ul>
          <li><a href={`${env.backendUrl}/login`}>Abrir login do GeRot</a></li>
          <li><a href={`${env.backendUrl}/dashboard`}>Abrir dashboard do GeRot</a></li>
        </ul>
      </div>

      <div className="next-steps">
        <h2>Proximos passos</h2>
        <ul>
          <li>Criar modulos por dominio em <code>src/modules</code></li>
          <li>Adicionar rotas e layouts compartilhados</li>
          <li>Conectar endpoints reais do backend poliglota</li>
        </ul>
      </div>
    </main>
  )
}

export default App
