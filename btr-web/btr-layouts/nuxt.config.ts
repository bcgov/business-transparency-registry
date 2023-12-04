// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: [
    '../btr-common-components'
  ],
  ui: {
    icons: ['mdi'] // add here more icon sets from iconifiy if needed.
  },
  colorMode: {
    preference: 'light'
  },
  typescript: {
    strict: true,
    includeWorkspace: true
  },
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui',
    '@nuxtjs/eslint-module',
    '@nuxtjs/i18n',
    '@pinia/nuxt',
    'nuxt-vitest'
  ],
  imports: {
    dirs: ['enums', 'interfaces', 'stores']
  },
  i18n: {
    lazy: true,
    defaultLocale: 'en',
    langDir: './lang',
    locales: [
      { code: 'en', file: 'en.json' }
    ]
  },
  eslint: {
    /* module options */
    lintOnStart: false,
    include: ['/**/*.{js,jsx,ts,tsx,vue}']
  },
  pinia: {
    /* pinia module options */
  },
  runtimeConfig: {
    public: {
      // Keys within public, will be also exposed to the client-side
      version: process.env.npm_package_version || ''
    }
  }
})
