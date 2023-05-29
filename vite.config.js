import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'url';
// https://vitejs.dev/config/
export default defineConfig({  
  resolve: {
    alias: [      
        { find: '@/', replacement : fileURLToPath(new URL('./src/', import.meta.url))}
      
    ]
  },
  plugins: [
    vue()
  ],
  server: {
    proxy: {
      "^/exp/.*/.*/.*" :{
        target: 'https://localhost:8081',
        rewrite: (path) => path.replace(/^\/exp/, '/run'),
        secure: false
      },
      "^/api/.*" :{
        target: 'https://localhost:8081',
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: false,        
      },
      "^/preview/.*/.*/.*" :{
        target: 'https://localhost:8081',
        rewrite: (path) => path.replace(/^\/preview(\/\d+\/\d+)(\/.*)$/, "/task$1/execute$2"),
        secure: false
      },
    }
  }
})
