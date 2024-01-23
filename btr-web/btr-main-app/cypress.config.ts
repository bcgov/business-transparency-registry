import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents (on, config) {
      on('task', {
        log (message) {
          console.info(message)

          return null
        }
      })
    },
    supportFile: 'cypress/support/e2e.ts'
  }
})
