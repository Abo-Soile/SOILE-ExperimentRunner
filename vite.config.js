import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'
import { fileURLToPath, URL } from 'url';

// https://vitejs.dev/config/
export default defineConfig({  
  resolve: {
    alias: {      
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  plugins: [
    vue({})
  ],
  server: {
    proxy: {
      "^/exp/.*/.*/.*" :{
        target: 'https://localhost:8081',
        rewrite: (path) => path.replace(/^\/exp/, '/run'),
        secure: false
      },
      "/api/*" :{
        target: 'https://localhost:8081',
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
