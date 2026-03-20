import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/spotto-finance/',
  build: {
    outDir: 'output',
    emptyOutDir: true,
  },
})
