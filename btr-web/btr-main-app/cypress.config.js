import { defineConfig } from 'cypress'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  component: {
    devServer: {
      framework: 'vue',
      bundler: 'vite',
      plugins: [
        vue({
          template: {
            compilerOptions: {
              isCustomElement: tag => tag.includes('-')
            }
          }
        })
      ]
    }
  },
  e2e: {
    baseUrl: 'http://localhost:1234',
    supportFile: false
  }
})
