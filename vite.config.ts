import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // The production site is served from https://igor1112224446.github.io/Rentch/.
  base: '/Rentch/',
  plugins: [react()],
})
