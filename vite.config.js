import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base:'/Tasks-reminder/',
  plugins: [
    tailwindcss(),
  ],
})