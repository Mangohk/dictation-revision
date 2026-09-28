import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        dictation1: resolve(__dirname, 'dictations/1/index.html'),
      },
    },
  },
})
