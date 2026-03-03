import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { httpGet, httpPost, httpPut, httpDelete } from '../services/httpClient'

const OccurrenceContext = createContext()

const API_BASE = '/api/insights/occurrences'

export function OccurrenceProvider({ children }) {
  const [occurrences, setOccurrences] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadOccurrences = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const payload = await httpGet(API_BASE)
      setOccurrences(Array.isArray(payload?.occurrences) ? payload.occurrences : [])
    } catch (err) {
      setError(err?.message || 'Erro ao carregar ocorrências')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadOccurrences()
  }, [loadOccurrences])

  const addOccurrence = async (occurrence) => {
    const created = await httpPost(API_BASE, { body: JSON.stringify(occurrence) })
    setOccurrences((prev) => [created, ...prev])
    return created
  }

  const updateOccurrence = async (id, data) => {
    const updated = await httpPut(`${API_BASE}/${id}`, { body: JSON.stringify(data) })
    setOccurrences((prev) => prev.map((o) => (String(o.id) === String(id) ? updated : o)))
    return updated
  }

  const deleteOccurrence = async (id) => {
    await httpDelete(`${API_BASE}/${id}`)
    setOccurrences((prev) => prev.filter((o) => String(o.id) !== String(id)))
  }

  return (
    <OccurrenceContext.Provider
      value={{
        occurrences,
        loading,
        error,
        reload: loadOccurrences,
        addOccurrence,
        updateOccurrence,
        deleteOccurrence,
      }}
    >
      {children}
    </OccurrenceContext.Provider>
  )
}

export function useOccurrences() {
  const context = useContext(OccurrenceContext)
  if (!context) {
    throw new Error('useOccurrences must be used within an OccurrenceProvider')
  }
  return context
}
