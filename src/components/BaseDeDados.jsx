import { useState } from 'react'
import { useOccurrences } from '../hooks/useOccurrences'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { Modal } from '../components/ui/Modal'
import { Plus, Search, Trash2, Eye, Database, Filter } from 'lucide-react'

const statusColor = {
  Aberto: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  Tratado: 'bg-blue-100 text-blue-800 border-blue-200',
  Recorrente: 'bg-orange-100 text-orange-800 border-orange-200',
  Encerrado: 'bg-green-100 text-green-800 border-green-200',
}

const impactoColor = {
  Baixo: 'bg-gray-100 text-gray-800 border-gray-200',
  Médio: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  Alto: 'bg-red-100 text-red-800 border-red-200',
  Crítico: 'bg-purple-100 text-purple-800 border-purple-200',
}

const CATEGORIES = ['cliente', 'comercial', 'atendimento', 'operacao', 'armazem', 'financeiro', 'planejamento', 'motorista', 'externo']

export default function BaseDeDados() {
  const { occurrences, loading, error } = useOccurrences()
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterCategoria, setFilterCategoria] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [selectedOccurrence, setSelectedOccurrence] = useState(null)

  const filtered = occurrences.filter((o) => {
    const matchSearch = !search || 
      o.descricao?.toLowerCase().includes(search.toLowerCase()) ||
      o.responsavel?.toLowerCase().includes(search.toLowerCase()) ||
      o.subcategoria?.toLowerCase().includes(search.toLowerCase())
    
    const matchStatus = filterStatus === 'all' || o.status === filterStatus
    const matchCat = filterCategoria === 'all' || o.categoria === filterCategoria
    
    return matchSearch && matchStatus && matchCat
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Database className="h-6 w-6" />
            Base de Dados
          </h2>
          <p className="text-muted-foreground">
            Gerenciamento de ocorrências e registros operacionais
          </p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Ocorrência
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Buscar ocorrências..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background"
            >
              <option value="all">Todos Status</option>
              <option value="Aberto">Aberto</option>
              <option value="Tratado">Tratado</option>
              <option value="Recorrente">Recorrente</option>
              <option value="Encerrado">Encerrado</option>
            </select>
            <select
              value={filterCategoria}
              onChange={(e) => setFilterCategoria(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background"
            >
              <option value="all">Todas Categorias</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Data</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Categoria</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Subcategoria</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Responsável</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Descrição</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Impacto</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((occurrence) => (
                  <tr key={occurrence.id} className="hover:bg-muted/25">
                    <td className="px-4 py-3 text-sm">{occurrence.data}</td>
                    <td className="px-4 py-3 text-sm">
                      <Badge variant="outline" className="capitalize">
                        {occurrence.categoria}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm">{occurrence.subcategoria}</td>
                    <td className="px-4 py-3 text-sm">{occurrence.responsavel}</td>
                    <td className="px-4 py-3 text-sm max-w-xs truncate">{occurrence.descricao}</td>
                    <td className="px-4 py-3 text-sm">
                      <Badge className={impactoColor[occurrence.impacto_operacional] || ''}>
                        {occurrence.impacto_operacional}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <Badge className={statusColor[occurrence.status] || ''}>
                        {occurrence.status || 'Aberto'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedOccurrence(occurrence)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Nenhuma ocorrência encontrada
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Detail Modal */}
      {selectedOccurrence && (
        <Modal
          isOpen={!!selectedOccurrence}
          onClose={() => setSelectedOccurrence(null)}
          title="Detalhes da Ocorrência"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Data</label>
                <p className="text-sm">{selectedOccurrence.data}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Categoria</label>
                <p className="text-sm capitalize">{selectedOccurrence.categoria}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Subcategoria</label>
                <p className="text-sm">{selectedOccurrence.subcategoria}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Responsável</label>
                <p className="text-sm">{selectedOccurrence.responsavel}</p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Descrição</label>
              <p className="text-sm mt-1">{selectedOccurrence.descricao}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Impacto Financeiro</label>
                <p className="text-sm">R$ {selectedOccurrence.impacto_financeiro?.toFixed(2) || '0.00'}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Impacto Operacional</label>
                <Badge className={impactoColor[selectedOccurrence.impacto_operacional] || ''}>
                  {selectedOccurrence.impacto_operacional}
                </Badge>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSelectedOccurrence(null)}>
                Fechar
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Modal Placeholder */}
      {showModal && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Nova Ocorrência"
        >
          <div className="text-center py-8 text-muted-foreground">
            Funcionalidade de adicionar ocorrência em desenvolvimento
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
          </div>
        </Modal>
      )}
    </div>
  )
}
