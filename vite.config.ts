import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  // base:'./',
   build: {
    rollupOptions: {
      external: [
        '/assets/libs/**/*.js',
        '/assets/js/**/*.js'
      ]
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/../assets/scss/styles.scss";`
      }
    }
  }
})
