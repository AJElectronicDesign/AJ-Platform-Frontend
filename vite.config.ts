import { loadEnv } from 'vite'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiUrl = (process.env.VITE_API_URL ?? env.VITE_API_URL ?? '').trim()

  if (mode === 'production' && !apiUrl) {
    throw new Error(
      'VITE_API_URL is required for a production build. Set it to the backend origin.',
    )
  }

  return {
    base: '/AJ-Platform-Frontend/',
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, './src'),
      },
    },
    test: {
      environment: 'happy-dom',
      setupFiles: ['./src/test/setup.ts'],
      env: {
        VITE_API_URL: 'http://api.test',
      },
    },
  }
})
