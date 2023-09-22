import { defineConfig } from 'cypress'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: false
  }
})
