import { useMemo, useState } from 'react'
import { User, Lock, Save, Pencil, X, CheckCircle2, AlertTriangle } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { useAuth } from '../context/useAuth'
import { httpPut } from '../services/httpClient'
import api from '../api/endpoints'

export default function Perfil() {
  const { user } = useAuth()

  const [editProfile, setEditProfile] = useState(false)
  const [savingProfile, setSavingProfile] = useState(false)
  const [profileError, setProfileError] = useState(null)
  const [profileSuccess, setProfileSuccess] = useState(null)

  const [profile, setProfile] = useState({
    nome_completo: user?.nome_completo || '',
    username: user?.username || '',
    departamento: user?.departamento || '',
    email: user?.email || '',
  })

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  })

  const [savingPassword, setSavingPassword] = useState(false)
  const [passwordError, setPasswordError] = useState(null)
  const [passwordSuccess, setPasswordSuccess] = useState(null)

  const profileDirty = useMemo(() => {
    const nome = (profile.nome_completo || '').trim()
    const dept = (profile.departamento || '').trim()
    const email = (profile.email || '').trim()
    const uNome = (user?.nome_completo || '').trim()
    const uDept = (user?.departamento || '').trim()
    const uEmail = (user?.email || '').trim()
    return nome !== uNome || dept !== uDept || email !== uEmail
  }, [profile, user])

  const passwordValid = useMemo(() => {
    if (!passwords.current || !passwords.new || !passwords.confirm) return false
    if (passwords.new.length < 6) return false
    if (passwords.new !== passwords.confirm) return false
    return true
  }, [passwords])

  const profileValidationError = useMemo(() => {
    if (!editProfile) return null
    if ((profile.nome_completo || '').trim().length < 2) return 'Informe seu nome completo'
    if ((profile.email || '').trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((profile.email || '').trim())) {
      return 'E-mail inválido'
    }
    return null
  }, [editProfile, profile])

  async function onSaveProfile() {
    setSavingProfile(true)
    setProfileError(null)
    setProfileSuccess(null)

    try {
      if (profileValidationError) {
        setProfileError(profileValidationError)
        return
      }

      const payload = {
        nome_completo: (profile.nome_completo || '').trim(),
        departamento: (profile.departamento || '').trim() || null,
        email: (profile.email || '').trim() || null,
      }

      const res = await httpPut(api.sessionUpdate, { body: JSON.stringify(payload) })
      if (res?.user) {
        setProfileSuccess('Perfil atualizado')
        setEditProfile(false)
      } else {
        setProfileSuccess('Perfil atualizado')
        setEditProfile(false)
      }
    } catch (e) {
      setProfileError(e?.message || 'Falha ao atualizar perfil')
    } finally {
      setSavingProfile(false)
    }
  }

  function onCancelProfile() {
    setProfileError(null)
    setProfileSuccess(null)
    setEditProfile(false)
    setProfile({
      nome_completo: user?.nome_completo || '',
      username: user?.username || '',
      departamento: user?.departamento || '',
      email: user?.email || '',
    })
  }

  async function onSavePassword() {
    setSavingPassword(true)
    setPasswordError(null)
    setPasswordSuccess(null)
    try {
      if (!passwordValid) {
        if (!passwords.current || !passwords.new || !passwords.confirm) {
          setPasswordError('Preencha todos os campos')
          return
        }
        if (passwords.new.length < 6) {
          setPasswordError('A nova senha deve ter pelo menos 6 caracteres')
          return
        }
        if (passwords.new !== passwords.confirm) {
          setPasswordError('Confirmação não confere')
          return
        }
      }

      await httpPut(api.changePassword, {
        body: JSON.stringify({
          current_password: passwords.current,
          new_password: passwords.new,
        }),
      })
      setPasswordSuccess('Senha atualizada')
      setPasswords({ current: '', new: '', confirm: '' })
    } catch (e) {
      setPasswordError(e?.message || 'Falha ao atualizar senha')
    } finally {
      setSavingPassword(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Perfil</h2>
        <p className="mt-1 text-sm text-muted-foreground">Gerencie suas informações pessoais</p>
      </div>

      {/* Profile Info */}
      <Card>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <User size={22} className="text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Informações Pessoais</h3>
            <p className="text-xs text-muted-foreground">Atualize seus dados de perfil</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {!editProfile ? (
              <Button size="sm" variant="outline" onClick={() => { setEditProfile(true); setProfileError(null); setProfileSuccess(null) }}>
                <Pencil size={14} />
                Editar
              </Button>
            ) : (
              <Button size="sm" variant="ghost" onClick={onCancelProfile}>
                <X size={14} />
                Cancelar
              </Button>
            )}
          </div>
        </div>

        {profileSuccess ? (
          <div className="mb-4 flex items-start gap-2 rounded-lg border border-success/30 bg-success/10 px-3 py-2 text-sm text-success">
            <CheckCircle2 size={16} className="mt-0.5" />
            <span>{profileSuccess}</span>
          </div>
        ) : null}
        {profileError ? (
          <div className="mb-4 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            <AlertTriangle size={16} className="mt-0.5" />
            <span>{profileError}</span>
          </div>
        ) : null}

        <div className="space-y-4">
          <Input
            label="Nome"
            value={profile.nome_completo}
            onChange={(e) => setProfile({ ...profile, nome_completo: e.target.value })}
            placeholder="Seu nome completo"
            disabled={!editProfile || savingProfile}
          />
          <Input
            label="Username"
            value={profile.username}
            onChange={(e) => setProfile({ ...profile, username: e.target.value })}
            placeholder="seu.usuario"
            disabled
          />
          <Input
            label="Departamento"
            value={profile.departamento}
            onChange={(e) => setProfile({ ...profile, departamento: e.target.value })}
            placeholder="Ex.: Comercial"
            disabled={!editProfile || savingProfile}
          />
          <Input
            label="E-mail"
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            placeholder="voce@empresa.com"
            disabled={!editProfile || savingProfile}
          />
          <div className="flex justify-end pt-2">
            <Button
              size="sm"
              onClick={onSaveProfile}
              disabled={!editProfile || savingProfile || !profileDirty || !!profileValidationError}
            >
              <Save size={14} />
              {savingProfile ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Password */}
      <Card>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-warning/10">
            <Lock size={22} className="text-warning" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Alterar Senha</h3>
            <p className="text-xs text-muted-foreground">Atualize sua senha de acesso</p>
          </div>
        </div>
        <div className="space-y-4">
          <Input
            label="Senha atual"
            type="password"
            value={passwords.current}
            onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
            disabled={savingPassword}
          />
          <Input
            label="Nova senha"
            type="password"
            value={passwords.new}
            onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
            disabled={savingPassword}
            error={passwords.new && passwords.new.length > 0 && passwords.new.length < 6 ? 'Mínimo 6 caracteres' : null}
          />
          <Input
            label="Confirmar nova senha"
            type="password"
            value={passwords.confirm}
            onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
            disabled={savingPassword}
            error={passwords.confirm && passwords.new !== passwords.confirm ? 'Confirmação não confere' : null}
          />

          {passwordSuccess ? (
            <div className="flex items-start gap-2 rounded-lg border border-success/30 bg-success/10 px-3 py-2 text-sm text-success">
              <CheckCircle2 size={16} className="mt-0.5" />
              <span>{passwordSuccess}</span>
            </div>
          ) : null}
          {passwordError ? (
            <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              <AlertTriangle size={16} className="mt-0.5" />
              <span>{passwordError}</span>
            </div>
          ) : null}

          <div className="flex justify-end pt-2">
            <Button variant="outline" size="sm" onClick={onSavePassword} disabled={savingPassword || !passwordValid}>
              <Lock size={14} />
              {savingPassword ? 'Alterando...' : 'Alterar senha'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
