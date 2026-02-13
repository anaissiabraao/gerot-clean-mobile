import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import './index.css'
import App from './App.jsx'

const iconEl = document.querySelector('link[rel="icon"]') ?? document.createElement('link')
iconEl.setAttribute('rel', 'icon')
iconEl.setAttribute('type', 'image/png')
iconEl.setAttribute('href', '/portoex-logo.png')
if (!iconEl.parentNode) {
  document.head.appendChild(iconEl)
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
