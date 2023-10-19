// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: [
    '../btr-layouts',
    '../btr-common-components'
  ],
  ssr: false,
  typescript: {
    strict: true,
    includeWorkspace: true
  },
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui',
    '@nuxtjs/eslint-module',
    '@nuxtjs/stylelint-module',
    '@pinia/nuxt',
    'nuxt-vitest'
  ],
  eslint: {
    /* module options */
    lintOnStart: false,
    include: ['/**/*.{js,jsx,ts,tsx,vue}']
  },
  stylelint: {
    /* module options */
    lintOnStart: false
  },
  pinia: {
    /* pinia module options */
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "../btr-common-components/assets/styles/theme.scss" as *;'
        }
      }
    }
  }
})
