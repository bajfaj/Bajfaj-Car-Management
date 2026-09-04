import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Load env file based on mode: .env.development, .env.test, .env.production
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react()],
    server: {
      port: 5173, // UI runs here
      proxy: {
        '/api': {
          target: env.VITE_API_URL, // API goes to 3001/3002/3000
          changeOrigin: true,
        }
      }
    }
  }
})