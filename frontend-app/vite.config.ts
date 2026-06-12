import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // El backend de Express usa el 3000 por defecto
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
