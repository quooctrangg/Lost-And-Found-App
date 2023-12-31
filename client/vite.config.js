import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import { config } from 'dotenv'
config()

export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: process.env.VITE_PORT,
    proxy: {
      "/api/": {
        target: process.env.VITE_URL_API,
        changeOrigin: true
      }
    }
  }
})
