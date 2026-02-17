import { useMemo, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { LogIn, Lock, User as UserIcon } from 'lucide-react'
import { useAuth } from '../context/useAuth'
import env from '../config/env'
import { Card, CardTitle, CardDescription } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'

function getNextFromLocation(location) {
  const qs = new URLSearchParams(location.search || '')
  const next = (qs.get('next') || '').trim()
  if (next) return next
  return window.location.origin + '/'
}

export default function Login() {
  const { user, login } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const next = useMemo(() => getNextFromLocation(location), [location])

  if (!env.apiBaseUrl || env.redirectToBackendLogin) {
    return <Navigate to="/" replace />
  }

  if (user) {
    return <Navigate to="/" replace />
  }

  async function onSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      await login({ username, password, next })
      navigate('/', { replace: true })
    } catch (err) {
      setError(err?.message || 'Falha no login')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-10">
      <div className="w-full max-w-md">
        <Card className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 opacity-60">
            <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-secondary/20 blur-3xl" />
          </div>

          <div className="relative">
            <div className="mb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                  <LogIn size={20} />
                </div>
                <div>
                  <CardTitle>Entrar</CardTitle>
                  <CardDescription className="mt-1">
                    Acesse com seu usuário e senha
                  </CardDescription>
                </div>
              </div>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              <div className="relative">
                <div className="pointer-events-none absolute left-3 top-[38px] text-muted-foreground">
                  <UserIcon size={16} />
                </div>
                <Input
                  id="username"
                  label="Usuário"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  placeholder="ex.: anaissiabraao"
                  required
                  className="pl-10"
                />
              </div>

              <div className="relative">
                <div className="pointer-events-none absolute left-3 top-[38px] text-muted-foreground">
                  <Lock size={16} />
                </div>
                <Input
                  id="password"
                  label="Senha"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  placeholder="Sua senha"
                  required
                  className="pl-10"
                />
              </div>

              {error ? (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </div>
              ) : null}

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? 'Entrando...' : 'Entrar'}
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                {new Date().getFullYear()} GeRot
              </p>
            </form>
          </div>
        </Card>
      </div>
    </div>
  )
}
