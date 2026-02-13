import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const rootDir = dirname(fileURLToPath(import.meta.url))
  const env = loadEnv(mode, rootDir, '')
  const backendUrl = env.VITE_BACKEND_URL || 'http://localhost:5000'

  return {
    cacheDir: '/tmp/vite-cache',
    plugins: [react()],
    resolve: {
      alias: {
        '@': resolve(rootDir, 'src'),
      },
    },
    server: {
      port: 8080,
      proxy: {
        '/api': {
          target: backendUrl,
          changeOrigin: true,
        },
      },
    },
    preview: {
      host: true,
      allowedHosts: true,
    },
  }
})
