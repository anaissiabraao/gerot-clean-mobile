import { useEffect } from 'react'
import './App.css'
import env from './config/env'
import { BackendStatusCard } from './modules/health/components/BackendStatusCard'

function App() {
  useEffect(() => {
    if (!env.redirectToBackendLogin || !env.backendUrl) {
      return
    }

    if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
      window.location.replace(`${env.backendUrl}/login`)
    }
  }, [])

  return (
    <main className="app-shell">
      <header className="app-header">
        <h1>GeRot Frontend - Vite + React</h1>
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
