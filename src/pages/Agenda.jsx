import { useState, useEffect } from 'react'
import { Calendar, Plus, Edit, Trash2, Clock } from 'lucide-react'
import { httpGet, httpPost, httpPut, httpDelete } from '../services/httpClient'
import api from '../api/endpoints'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { Input } from '../components/ui/Input'
import { EmptyState } from '../components/ui/EmptyState'
import { SkeletonCard } from '../components/ui/Skeleton'

export default function Agenda() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ title: '', date: '', time_start: '', time_end: '', room: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => { loadBookings() }, [])

  async function loadBookings() {
    setLoading(true)
    setError(null)
    try {
      const data = await httpGet(api.roomBookings)
      setBookings(Array.isArray(data) ? data : data?.bookings || data?.data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function openNew() {
    setEditing(null)
    setForm({ title: '', date: '', time_start: '', time_end: '', room: '' })
    setModalOpen(true)
  }

  function openEdit(b) {
    setEditing(b)
    setForm({
      title: b.title || b.name || '',
      date: b.date || '',
      time_start: b.time_start || b.start || '',
      time_end: b.time_end || b.end || '',
      room: b.room || b.sala || '',
    })
    setModalOpen(true)
  }

  async function handleSave() {
    setSaving(true)
    try {
      const body = JSON.stringify(form)
      if (editing) {
        await httpPut(api.roomBooking(editing.id), { body })
      } else {
        await httpPost(api.roomBookings, { body })
      }
      setModalOpen(false)
      loadBookings()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Excluir este agendamento?')) return
    try {
      await httpDelete(api.roomBooking(id))
      loadBookings()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Agenda CD</h2>
          <p className="mt-1 text-sm text-muted-foreground">Agendamentos de salas e recursos</p>
        </div>
        <Button onClick={openNew} size="sm">
          <Plus size={14} />
          Novo agendamento
        </Button>
      </div>

      {error && (
        <Card className="border-destructive/20 bg-destructive/5">
          <p className="text-sm text-destructive">{error}</p>
        </Card>
      )}

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : bookings.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="Nenhum agendamento"
          description="Crie seu primeiro agendamento para começar."
          action="Novo agendamento"
          onAction={openNew}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bookings.map((b, idx) => (
            <div key={b.id || idx} className="stagger-child">
              <Card className="flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-sm font-semibold text-foreground">
                      {b.title || b.name || `Agendamento ${idx + 1}`}
                    </h4>
                    {b.room && <Badge variant="outline">{b.room || b.sala}</Badge>}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock size={12} />
                    <span>
                      {b.date} {b.time_start || b.start}
                      {(b.time_end || b.end) && ` — ${b.time_end || b.end}`}
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => openEdit(b)}>
                    <Edit size={14} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(b.id)}>
                    <Trash2 size={14} className="text-destructive" />
                  </Button>
                </div>
              </Card>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Editar Agendamento' : 'Novo Agendamento'}
      >
        <div className="space-y-4">
          <Input label="Título" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Input label="Data" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Início" type="time" value={form.time_start} onChange={(e) => setForm({ ...form, time_start: e.target.value })} />
            <Input label="Fim" type="time" value={form.time_end} onChange={(e) => setForm({ ...form, time_end: e.target.value })} />
          </div>
          <Input label="Sala" value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })} />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} loading={saving}>Salvar</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
