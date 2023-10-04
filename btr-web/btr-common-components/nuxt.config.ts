// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ui: {
    icons: ['mdi'] // add here more icon sets from iconifiy if needed.
  },
  colorMode: {
    preference: 'light'
  },
  devtools: { enabled: true },
  typescript: {
    strict: true,
    includeWorkspace: true
  },
  modules: [
    '@nuxt/ui',
    '@nuxtjs/eslint-module',
    '@nuxtjs/stylelint-module',
    'nuxt-vitest',
    '@nuxtjs/i18n'
  ],
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
  stylelint: {
    /* module options */
    lintOnStart: false
  }
})
