import { useEffect, useMemo, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Users, LayoutDashboard, Link2 } from 'lucide-react'
import { useAuth } from '../context/useAuth'
import { httpGet } from '../services/httpClient'
import { Card, CardTitle, CardDescription } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { SkeletonCard } from '../components/ui/Skeleton'
import { EmptyState } from '../components/ui/EmptyState'

function Table({ columns, rows, keyField }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="min-w-full text-sm">
        <thead className="bg-muted/40 text-muted-foreground">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="px-3 py-2 text-left font-medium">
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r[keyField]} className="border-t border-border">
              {columns.map((c) => (
                <td key={c.key} className="px-3 py-2 align-top">
                  {typeof c.render === 'function' ? c.render(r) : r[c.key] ?? '—'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function Admin() {
  const { user } = useAuth()
  const isAdmin = (user?.role || '').toString().toLowerCase() === 'admin'

  const [tab, setTab] = useState('users')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [users, setUsers] = useState([])
  const [assets, setAssets] = useState([])
  const [assignments, setAssignments] = useState([])

  useEffect(() => {
    if (!isAdmin) return
    load()
  }, [isAdmin])

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const [u, a, asg] = await Promise.all([
        httpGet('/api/admin/users'),
        httpGet('/api/admin/assets?status=ativo&limit=500'),
        httpGet('/api/admin/asset-assignments?limit=500'),
      ])
      setUsers(Array.isArray(u?.items) ? u.items : [])
      setAssets(Array.isArray(a?.items) ? a.items : [])
      setAssignments(Array.isArray(asg?.items) ? asg.items : [])
    } catch (e) {
      setError(e?.message || 'Falha ao carregar admin')
      setUsers([])
      setAssets([])
      setAssignments([])
    } finally {
      setLoading(false)
    }
  }

  const assetById = useMemo(() => {
    const m = new Map()
    for (const a of assets) m.set(a.id, a)
    return m
  }, [assets])

  if (!user) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/" replace />

  const tabBtn = (id, label) => (
    <button
      type="button"
      onClick={() => setTab(id)}
      className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
        tab === id ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:bg-accent hover:text-foreground'
      }`}
    >
      {label}
    </button>
  )

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Admin</h2>
          <p className="mt-1 text-sm text-muted-foreground">Usuários, assets e atribuições de visibilidade</p>
        </div>
        <Button variant="outline" size="sm" onClick={load}>
          Atualizar
        </Button>
      </div>

      <Card>
        <div className="flex flex-wrap gap-2">
          {tabBtn('users', 'Usuários')}
          {tabBtn('assets', 'Dashboards (Assets)')}
          {tabBtn('assignments', 'Atribuições')}
        </div>
      </Card>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : error ? (
        <Card className="border-destructive/20 bg-destructive/5">
          <p className="text-sm text-destructive">{error}</p>
        </Card>
      ) : tab === 'users' ? (
        <Card>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <CardTitle>Usuários</CardTitle>
              <CardDescription className="mt-1">Lista de usuários (role e departamento)</CardDescription>
            </div>
            <Badge variant="outline">{users.length}</Badge>
          </div>
          {users.length === 0 ? (
            <EmptyState icon={Users} title="Nenhum usuário" description="Sem dados de usuários no backend." />
          ) : (
            <Table
              keyField="id"
              columns={[
                { key: 'id', header: 'ID' },
                { key: 'username', header: 'Usuário' },
                { key: 'nome_completo', header: 'Nome' },
                { key: 'departamento', header: 'Departamento' },
                {
                  key: 'role',
                  header: 'Role',
                  render: (r) => (
                    <Badge variant={String(r.role).toLowerCase() === 'admin' ? 'primary' : 'outline'}>
                      {r.role || '—'}
                    </Badge>
                  ),
                },
                {
                  key: 'is_active',
                  header: 'Ativo',
                  render: (r) => (
                    <Badge variant={r.is_active === false ? 'destructive' : 'success'}>
                      {r.is_active === false ? 'Não' : 'Sim'}
                    </Badge>
                  ),
                },
              ]}
              rows={users}
            />
          )}
        </Card>
      ) : tab === 'assets' ? (
        <Card>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <CardTitle>Assets</CardTitle>
              <CardDescription className="mt-1">Dashboards/recursos disponíveis em `assets`</CardDescription>
            </div>
            <Badge variant="outline">{assets.length}</Badge>
          </div>
          {assets.length === 0 ? (
            <EmptyState icon={LayoutDashboard} title="Nenhum asset" description="Sem assets ativos cadastrados." />
          ) : (
            <Table
              keyField="id"
              columns={[
                { key: 'id', header: 'ID' },
                { key: 'nome', header: 'Nome' },
                { key: 'tipo', header: 'Tipo' },
                { key: 'categoria', header: 'Categoria' },
                {
                  key: 'embed_url',
                  header: 'Embed',
                  render: (r) => (r.embed_url ? <Badge variant="outline">OK</Badge> : '—'),
                },
                {
                  key: 'resource_url',
                  header: 'Link',
                  render: (r) =>
                    r.resource_url ? (
                      <a
                        href={r.resource_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-primary hover:underline"
                      >
                        <Link2 size={14} />
                        abrir
                      </a>
                    ) : (
                      '—'
                    ),
                },
              ]}
              rows={assets}
            />
          )}
        </Card>
      ) : (
        <Card>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <CardTitle>Atribuições</CardTitle>
              <CardDescription className="mt-1">
                Regras de visibilidade (por usuário ou por departamento)
              </CardDescription>
            </div>
            <Badge variant="outline">{assignments.length}</Badge>
          </div>
          {assignments.length === 0 ? (
            <EmptyState title="Nenhuma atribuição" description="Sem registros em asset_assignments." />
          ) : (
            <Table
              keyField="id"
              columns={[
                { key: 'id', header: 'ID' },
                { key: 'asset_id', header: 'Asset' , render: (r) => {
                  const a = assetById.get(r.asset_id)
                  return a ? `${r.asset_id} - ${a.nome}` : r.asset_id
                }},
                { key: 'user_id', header: 'User ID' },
                { key: 'group_name', header: 'Departamento' },
                {
                  key: 'visivel',
                  header: 'Visível',
                  render: (r) => (
                    <Badge variant={r.visivel === false ? 'destructive' : 'success'}>
                      {r.visivel === false ? 'Não' : 'Sim'}
                    </Badge>
                  ),
                },
                { key: 'ordem', header: 'Ordem' },
              ]}
              rows={assignments}
            />
          )}
        </Card>
      )}
    </div>
  )
}
