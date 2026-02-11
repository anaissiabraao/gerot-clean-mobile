import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import env from './config/env'
import portoexLogoUrl from '../static/portoex-logo.png?url'

const iconEl = document.querySelector('link[rel="icon"]') ?? document.createElement('link')
iconEl.setAttribute('rel', 'icon')
iconEl.setAttribute('type', 'image/png')
iconEl.setAttribute('href', portoexLogoUrl)
if (!iconEl.parentNode) {
  document.head.appendChild(iconEl)
}

if (env.backendUrl && (env.forceLogin || env.redirectToBackendLogin)) {
  const next = encodeURIComponent(window.location.origin + window.location.pathname + window.location.search)
  window.location.replace(`${env.backendUrl}/login?next=${next}`)
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
