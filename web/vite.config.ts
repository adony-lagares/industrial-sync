import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves this project under /industrial-sync/, not the domain root.
  base: process.env.GH_PAGES === 'true' ? '/industrial-sync/' : '/',
})
