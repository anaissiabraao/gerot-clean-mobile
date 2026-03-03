import { useMemo, useState } from 'react'
import { useOccurrences } from '../hooks/useOccurrences'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/Select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { Modal } from '../components/ui/Modal'
import { Plus, Search, Trash2, Eye, Database, Filter } from 'lucide-react'
import { CATEGORIES, SUBCATEGORIES, STATUS_OPTIONS, IMPACTO_OPTIONS, FILIAIS, TIPOS } from '../data/occurrences'

const statusColor = {
  Aberto: 'bg-status-open/15 text-accent-foreground border-status-open/30',
  Tratado: 'bg-status-treated/15 text-status-treated border-status-treated/30',
  Recorrente: 'bg-status-recurring/15 text-status-recurring border-status-recurring/30',
  Encerrado: 'bg-status-closed/15 text-status-closed border-status-closed/30',
}

const impactoColor = {
  Baixo: 'bg-impact-low/15 text-impact-low border-impact-low/30',
  Médio: 'bg-impact-medium/15 text-accent-foreground border-impact-medium/30',
  Alto: 'bg-impact-high/15 text-impact-high border-impact-high/30',
  Crítico: 'bg-impact-critical/15 text-impact-critical border-impact-critical/30',
}

const emptyForm = {
  data: new Date().toISOString().split('T')[0],
  filial: '',
  tipo: '',
  placa: '',
  motorista: '',
  cliente: '',
  nf_md_oc: '',
  cidade_origem: '',
  cidade_destino: '',
  categoria: '',
  subcategoria: '',
  responsavel: '',
  descricao: '',
  horario_previsto: '',
  horario_ocorrido: '',
  impacto_financeiro: 0,
  impacto_operacional: 'Baixo',
  reprogramado: 'Não',
  data_reprogramacao: '',
  causa_raiz: '',
  plano_acao: '',
  status: 'Aberto',
  impacto_score: 1,
  frequencia: 1,
}

export default function BaseDeDados() {
  const { occurrences, addOccurrence, loading } = useOccurrences()
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterCategoria, setFilterCategoria] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [detail, setDetail] = useState(null)
  const [form, setForm] = useState(emptyForm)

  const filtered = useMemo(() => {
    return occurrences.filter((occ) => {
      const matchSearch =
        !search ||
        occ.descricao?.toLowerCase().includes(search.toLowerCase()) ||
        occ.responsavel?.toLowerCase().includes(search.toLowerCase()) ||
        occ.cliente?.toLowerCase().includes(search.toLowerCase())

      const matchStatus = filterStatus === 'all' || occ.status === filterStatus
      const matchCat = filterCategoria === 'all' || occ.categoria === filterCategoria
      return matchSearch && matchStatus && matchCat
    })
  }, [occurrences, search, filterStatus, filterCategoria])

  const openForm = () => {
    setForm(emptyForm)
    setShowModal(true)
  }

  const updateForm = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async () => {
    if (!form.filial || !form.tipo || !form.categoria || !form.responsavel) {
      return
    }
    const payload = {
      ...form,
      impacto_financeiro: Number(form.impacto_financeiro) || 0,
      impacto_score: Number(form.impacto_score) || 1,
      frequencia: Number(form.frequencia) || 1,
    }
    await addOccurrence(payload)
    setShowModal(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const total = filtered.length

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Database className="h-6 w-6" />
            Base de Dados
          </h2>
          <p className="text-muted-foreground text-sm">
            {total} ocorrência{total !== 1 ? 's' : ''} registrada{total !== 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={openForm} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Nova Ocorrência
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros em tempo real
          </CardTitle>
          <CardDescription>Busque por cliente, categoria ou status para encontrar o que precisa.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-4">
            <Input
              placeholder="Busca rápida"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos Status</SelectItem>
                {STATUS_OPTIONS.map((status) => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterCategoria} onValueChange={setFilterCategoria}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas Categorias</SelectItem>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.emoji} {cat.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center text-sm text-muted-foreground">
              Atualizado em tempo real com a base operacional
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="px-3 py-2 text-left">Data</th>
                  <th className="px-3 py-2 text-left">Filial</th>
                  <th className="px-3 py-2 text-left">Categoria</th>
                  <th className="px-3 py-2 text-left">Cliente</th>
                  <th className="px-3 py-2 text-left">Responsável</th>
                  <th className="px-3 py-2 text-left">Impacto</th>
                  <th className="px-3 py-2 text-left">Status</th>
                  <th className="px-3 py-2 text-left">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o, index) => (
                  <tr key={o.id} className={`border-b transition-colors hover:bg-muted/25 ${index % 2 === 0 ? 'bg-muted/5' : ''}`}>
                    <td className="px-3 py-2 font-mono text-xs text-muted-foreground">{o.data}</td>
                    <td className="px-3 py-2">{o.filial}</td>
                    <td className="px-3 py-2">
                      <Badge variant="outline" className={statusColor[o.status] || 'bg-muted/20'}>
                        {o.categoria}
                      </Badge>
                    </td>
                    <td className="px-3 py-2 font-medium">{o.cliente || 'Não informado'}</td>
                    <td className="px-3 py-2">{o.responsavel}</td>
                    <td className="px-3 py-2">
                      <Badge variant="outline" className={impactoColor[o.impacto_operacional] || 'bg-muted/20'}>
                        R$ {Number(o.impacto_financeiro || 0).toLocaleString('pt-BR', { style: 'decimal', minimumFractionDigits: 2 })}
                      </Badge>
                    </td>
                    <td className="px-3 py-2">
                      <Badge variant="outline" className={statusColor[o.status] || 'bg-muted/20'}>
                        {o.status}
                      </Badge>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex gap-2">
                        <Button size="icon" variant="ghost" onClick={() => setDetail(o)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">Nenhuma ocorrência encontrada</div>
            )}
          </div>
        </CardContent>
      </Card>

      <Modal open={!!detail} onClose={() => setDetail(null)} title="Detalhes da Ocorrência">
        {detail && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-muted-foreground uppercase">Data</p>
                <p>{detail.data}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase">Filial</p>
                <p>{detail.filial}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase">Categoria</p>
                <p>{detail.categoria}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase">Responsável</p>
                <p>{detail.responsavel}</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase">Descrição</p>
              <p className="text-sm text-muted-foreground">{detail.descricao}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-muted-foreground uppercase">Impacto financeiro</p>
                <p>R$ {Number(detail.impacto_financeiro || 0).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase">Impacto operacional</p>
                <Badge variant="outline" className={impactoColor[detail.impacto_operacional] || ''}>
                  {detail.impacto_operacional}
                </Badge>
              </div>
            </div>
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setDetail(null)}>Fechar</Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Registrar nova ocorrência">
        <div className="space-y-3 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input type="date" label="Data" value={form.data} onChange={(e) => updateForm('data', e.target.value)} />
            <Select value={form.filial} onValueChange={(v) => updateForm('filial', v)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filial" />
              </SelectTrigger>
              <SelectContent>
                {FILIAIS.map((filial) => (
                  <SelectItem key={filial} value={filial}>{filial}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={form.tipo} onValueChange={(v) => updateForm('tipo', v)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                {TIPOS.map((tipo) => (
                  <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input placeholder="Placa" value={form.placa} onChange={(e) => updateForm('placa', e.target.value)} />
            <Input placeholder="Motorista" value={form.motorista} onChange={(e) => updateForm('motorista', e.target.value)} />
            <Input placeholder="Cliente" value={form.cliente} onChange={(e) => updateForm('cliente', e.target.value)} />
            <Input placeholder="NF / MD / OC" value={form.nf_md_oc} onChange={(e) => updateForm('nf_md_oc', e.target.value)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Select value={form.categoria} onValueChange={(value) => {
              updateForm('categoria', value)
              updateForm('subcategoria', '')
            }}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.emoji} {cat.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={form.subcategoria} onValueChange={(value) => updateForm('subcategoria', value)} disabled={!form.categoria}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Subcategoria" />
              </SelectTrigger>
              <SelectContent>
                {(SUBCATEGORIES[form.categoria] || []).map((sub) => (
                  <SelectItem key={sub.id} value={sub.label}>{sub.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input placeholder="Responsável" value={form.responsavel} onChange={(e) => updateForm('responsavel', e.target.value)} />
            <Input type="number" placeholder="Impacto Financeiro" value={form.impacto_financeiro} onChange={(e) => updateForm('impacto_financeiro', e.target.value)} />
            <Select value={form.impacto_operacional} onValueChange={(value) => updateForm('impacto_operacional', value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Impacto Operacional" />
              </SelectTrigger>
              <SelectContent>
                {IMPACTO_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={form.status} onValueChange={(value) => updateForm('status', value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((status) => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input type="number" placeholder="Impacto Score" value={form.impacto_score} onChange={(e) => updateForm('impacto_score', e.target.value)} />
            <Input type="number" placeholder="Frequência" value={form.frequencia} onChange={(e) => updateForm('frequencia', e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-muted-foreground uppercase">Descrição</label>
            <Input value={form.descricao} onChange={(e) => updateForm('descricao', e.target.value)} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button onClick={handleSubmit} className="bg-primary text-primary-foreground hover:bg-primary/90">Salvar Ocorrência</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
