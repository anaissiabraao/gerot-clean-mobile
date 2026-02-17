import { useEffect, useState } from 'react'
import { AuthContext } from './AuthContextBase'
import { httpGet } from '../services/httpClient'
import api from '../api/endpoints'
import env from '../config/env'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const login = async ({ username, password, next } = {}) => {
    if (!env.apiBaseUrl) {
      throw new Error('API base URL não configurada')
    }

    const params = new URLSearchParams()
    params.set('username', (username ?? '').toString())
    params.set('password', (password ?? '').toString())
    if (next) params.set('next', next)

    const response = await fetch(`${env.apiBaseUrl}/login`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body: params.toString(),
      redirect: 'follow',
    })

    if (!response.ok) {
      const bodyText = await response.text()
      throw new Error(`HTTP ${response.status}: ${bodyText || response.statusText}`)
    }

    const data = await httpGet(api.session)
    const sessionUser = data?.user ?? null
    setUser(sessionUser)
    return sessionUser
  }

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
          setUser(data?.user ?? null)
        }
      } catch {
        if (!cancelled) {
          setUser(null)
          if (env.backendUrl && env.redirectToBackendLogin) {
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
    if (env.apiBaseUrl) {
      fetch(`${env.apiBaseUrl}/logout`, {
        method: 'POST',
        credentials: 'include',
      }).catch(() => {
      })
    }
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
