import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import { config } from 'dotenv'
import vue from '@vitejs/plugin-vue'

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
      "/apis/": {
        target: process.env.VITE_URL_API,
        changeOrigin: true
      }
    }
  }
})
