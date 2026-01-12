import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/InspireBubble/', // GitHub Pages 基础路径
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
