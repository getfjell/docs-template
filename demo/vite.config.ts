import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, '../src'),
    },
  },
  root: __dirname,
  publicDir: 'public',
  server: {
    port: 3001,
    open: true
  },
  define: {
    __APP_VERSION__: JSON.stringify('1.0.4-demo')
  }
})
