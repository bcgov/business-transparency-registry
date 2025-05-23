// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-16',
  modules: [
    'nuxt-anchorscroll'
  ],
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
  i18n: {
    lazy: true,
    defaultLocale: 'en',
    locales: [
      { code: 'en', file: 'en.json' }
    ]
  },
  imports: {
    dirs: ['enums', 'interfaces', 'stores']
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
      registryDashboardURL: process.env.VUE_APP_REGISTRY_URL || '',
      businessWebURL: process.env.VUE_APP_DASHBOARD_URL || ''
    }
  }
})
