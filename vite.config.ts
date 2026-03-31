import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api/ical': {
        target: 'https://www.airbnb.com',
        changeOrigin: true,
        rewrite: () => '/calendar/ical/45199069.ics?s=53a260a065935d4529c6c952f9592644&loc',
      }
    }
  }
})
