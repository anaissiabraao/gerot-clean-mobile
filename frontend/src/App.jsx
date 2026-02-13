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

    window.location.replace(`${env.backendUrl}/dashboard`)
  }, [])

  return null
}

export default App
