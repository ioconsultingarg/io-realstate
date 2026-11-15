import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base relativa: la misma build sirve en GitHub Pages (/io-realstate/) y en local
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})
