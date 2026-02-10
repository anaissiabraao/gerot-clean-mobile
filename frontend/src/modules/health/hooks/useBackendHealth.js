import { useCallback, useEffect, useState } from 'react'
import { getBackendHealth } from '../api/getBackendHealth'

const initialState = {
  loading: true,
  error: '',
  data: null,
}

export function useBackendHealth() {
  const [state, setState] = useState(initialState)

  const check = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: '' }))
    try {
      const data = await getBackendHealth()
      setState({ loading: false, error: '', data })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Falha ao consultar backend'
      setState({ loading: false, error: message, data: null })
    }
  }, [])

  useEffect(() => {
    const timerId = setTimeout(() => {
      void check()
    }, 0)

    return () => clearTimeout(timerId)
  }, [check])

  return {
    ...state,
    refresh: check,
  }
}
