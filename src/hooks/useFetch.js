import { useCallback, useEffect, useState } from 'react'
import { httpGet } from '../services/httpClient'

export function useFetch(path, { immediate = true } = {}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(immediate)
  const [error, setError] = useState(null)

  const execute = useCallback(async (queryParams) => {
    setLoading(true)
    setError(null)
    try {
      let url = path
      if (queryParams) {
        const qs = new URLSearchParams(queryParams).toString()
        url = `${path}?${qs}`
      }
      const result = await httpGet(url)
      setData(result)
      return result
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar dados'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [path])

  useEffect(() => {
    if (immediate) {
      execute().catch(() => {})
    }
  }, [execute, immediate])

  return { data, loading, error, refetch: execute }
}
