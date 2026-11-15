import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base relativa: la misma build sirve en GitHub Pages (/io-realstate/) y en local
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  // en Windows "localhost" puede quedar solo en IPv6 (::1) y Chrome lo rechaza: se fija IPv4
  server: { host: '127.0.0.1' },
  preview: { host: '127.0.0.1' },
})
