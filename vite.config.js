import { defineConfig } from 'vite'
import { resolve } from 'path'

// Relative base so built assets resolve under GitHub Pages project sites
// (https://<user>.github.io/<repo>/...) and local preview alike.
export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        dictation1: resolve(__dirname, 'dictations/1/index.html'),
      },
    },
  },
})
