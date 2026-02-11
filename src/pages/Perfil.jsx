import { useState } from 'react'
import { User, Lock, Save } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'

export default function Perfil() {
  const [profile, setProfile] = useState({
    name: '',
    username: '',
    email: '',
  })
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  })

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
        </div>
        <div className="space-y-4">
          <Input
            label="Nome"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            placeholder="Seu nome completo"
          />
          <Input
            label="Username"
            value={profile.username}
            onChange={(e) => setProfile({ ...profile, username: e.target.value })}
            placeholder="seu.usuario"
          />
          <Input
            label="E-mail"
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            placeholder="voce@empresa.com"
          />
          <div className="flex justify-end pt-2">
            <Button size="sm">
              <Save size={14} />
              Salvar perfil
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
          />
          <Input
            label="Nova senha"
            type="password"
            value={passwords.new}
            onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
          />
          <Input
            label="Confirmar nova senha"
            type="password"
            value={passwords.confirm}
            onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
          />
          <div className="flex justify-end pt-2">
            <Button variant="outline" size="sm">
              <Lock size={14} />
              Alterar senha
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
