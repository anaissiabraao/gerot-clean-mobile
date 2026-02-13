import { useEffect } from 'react'
import env from './config/env'

function App() {
  useEffect(() => {
    if (!env.backendUrl) {
      return
    }

    const backendOrigin = new URL(env.backendUrl).origin
    if (typeof window !== 'undefined' && window.location.origin === backendOrigin) {
      return
    }

    const next = encodeURIComponent(`${env.backendUrl}/dashboard?noredirect=1`)
    window.location.replace(`${env.backendUrl}/login?next=${next}`)
  }, [])

  return null
}

export default App
