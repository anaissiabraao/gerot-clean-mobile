import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const rootDir = dirname(fileURLToPath(import.meta.url))
  const env = loadEnv(mode, rootDir, '')
  const backendUrl = env.VITE_BACKEND_URL || 'http://localhost:5000'
  const frontendPort = Number(env.VITE_PORT || 5173)

  return {
    plugins: [react()],
    server: {
      port: frontendPort,
      proxy: {
        '/api': {
          target: backendUrl,
          changeOrigin: true,
        },
      },
    },
  }
})
