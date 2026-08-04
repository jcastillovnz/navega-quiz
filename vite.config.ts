import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// El base path cambia según la plataforma de deploy:
// - GitHub Pages: /navega-quiz/ (subdirectorio del repo)
// - Vercel/Netlify: / (raíz del dominio)
const isGhPages = process.env.GITHUB_PAGES === 'true'
const base = isGhPages ? '/navega-quiz/' : '/'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  base
})
