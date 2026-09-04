import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  // STRICT: fail if VITE_API_URL missing
  if (!env.VITE_API_URL) {
    throw new Error(`[VITE] FATAL: VITE_API_URL missing for mode '${mode}'. Check client/.env.${mode}`)
  }

  console.log(`[VITE] Mode: ${mode} -> API: ${env.VITE_API_URL}`)

  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: env.VITE_API_URL,
          changeOrigin: true,
        }
      }
    }
  }
})