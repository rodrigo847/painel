import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/painel/',
  server: {
    port: 5173,
    host: 'localhost',
    open: true,
    strictPort: false
  },
  build: {
    target: 'ES2020',
    sourcemap: false,
    minify: 'esbuild'
  }
})
