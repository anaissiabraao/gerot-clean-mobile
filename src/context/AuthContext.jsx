import { createContext, useContext, useEffect, useState } from 'react'
import { httpGet } from '../services/httpClient'
import api from '../api/endpoints'
import env from '../config/env'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function checkSession() {
      if (!env.apiBaseUrl) {
        setUser(null)
        setLoading(false)
        return
      }

      if (env.forceLogin && env.backendUrl) {
        try {
          await fetch(`${env.apiBaseUrl}/logout`, {
            method: 'POST',
            credentials: 'include',
          })
        } catch {
          // ignore
        }

        const next = encodeURIComponent(window.location.origin + window.location.pathname + window.location.search)
        window.location.replace(`${env.backendUrl}/login?next=${next}`)
        return
      }

      try {
        const data = await httpGet(api.session)
        if (!cancelled) {
          setUser(data)
        }
      } catch (err) {
        if (!cancelled) {
          setUser(null)
          if (
            env.backendUrl &&
            env.redirectToBackendLogin &&
            (err.message?.includes('401') || err.message?.includes('Não autenticado'))
          ) {
            const next = encodeURIComponent(window.location.origin + window.location.pathname + window.location.search)
            window.location.replace(`${env.backendUrl}/login?next=${next}`)
            return
          }
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    checkSession()
    return () => { cancelled = true }
  }, [])

  const logout = () => {
    if (env.backendUrl) {
      const next = encodeURIComponent(window.location.origin + '/')
      window.location.replace(`${env.backendUrl}/logout?next=${next}`)
    }
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
