import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'url';

// https://vitejs.dev/config/
export default defineConfig({  
  resolve: {
    alias: {
      vue: '@vue/compat',
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  plugins: [
    vue({
      template: {
        compilerOptions: {
          compatConfig: {
            MODE: 2
          }
        }
      }
    })
  ],
  server: {
    proxy: {
      "/exp/:id/*" :{
        target: 'localhost:8081',
        rewrite: (path) => path.replace(/^\/exp/, '/run')
      },
      "/api/*" :{
        target: 'localhost:8081',
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
