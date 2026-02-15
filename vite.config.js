import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  root: 'src',
  base: '/crossrd/',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
})
