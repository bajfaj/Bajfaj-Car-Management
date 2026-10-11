import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  if (!env.VITE_API_URL) {
    throw new Error(`[VITE] FATAL: VITE_API_URL missing for mode '${mode}'. Check client/.env.${mode}`)
  }
  // Remove /api from target to avoid double /api
  const target = env.VITE_API_URL.replace(/\/api\/?$/, '')

  console.log(`[VITE] Mode: ${mode} -> API: ${env.VITE_API_URL} -> Proxy target: ${target}`)

  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: target, // now http://localhost:3001 not /api
          changeOrigin: true,
        }
      }
    }
  }
})