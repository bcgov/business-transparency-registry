// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-16',
  ssr: false,
  ui: {
    icons: ['mdi'] // add here more icon sets from iconifiy if needed.
  },
  colorMode: {
    preference: 'light'
  },
  typescript: {
    strict: true
  },
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui',
    '@nuxtjs/eslint-module',
    '@nuxtjs/i18n',
    '@pinia/nuxt',
    '@nuxt/test-utils/module'
  ],
  imports: {
    dirs: ['enums', 'interfaces', 'stores']
  },
  i18n: {
    lazy: true,
    defaultLocale: 'en',
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
      addressCompleteKey: process.env.VUE_APP_ADDRESS_COMPLETE_KEY,
      authApiURL: `${process.env.VUE_APP_AUTH_API_URL || ''}${process.env.VUE_APP_AUTH_API_VERSION || ''}`,
      authWebURL: process.env.VUE_APP_AUTH_WEB_URL || '',
      kcURL: process.env.VUE_APP_KEYCLOAK_AUTH_URL || '',
      kcRealm: process.env.VUE_APP_KEYCLOAK_REALM || '',
      kcClient: process.env.VUE_APP_KEYCLOAK_CLIENTID || '',
      ldClientId: process.env.VUE_APP_LD_CLIENT_ID || '',
      legalApiURL: `${process.env.VUE_APP_LEGAL_API_URL || ''}${process.env.VUE_APP_LEGAL_API_VERSION_2 || ''}`,
      payApiURL: `${process.env.VUE_APP_PAY_API_URL || ''}${process.env.VUE_APP_PAY_API_VERSION || ''}`,
      btrApiURL: `${process.env.VUE_APP_BTR_API_URL || ''}${process.env.VUE_APP_BTR_API_VERSION || ''}`,
      searchApiURL:
      `${process.env.VUE_APP_REGISTRIES_SEARCH_API_URL || ''}${process.env.VUE_APP_REGISTRIES_SEARCH_API_VERSION_2 ||
        ''}`,
      searchApiKey: `${process.env.VUE_APP_REGISTRIES_SEARCH_API_KEY}`,
      registryHomeURL: process.env.VUE_APP_REGISTRY_HOME_URL || '',
      appEnv: `${process.env.VUE_APP_POD_NAMESPACE || 'unknown'}`
    }
  },
  css: ['~/../assets/scss/global.scss'],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          // tailwindcss has no .scss files; CSS processing done by PostCSS plugin
          // Vite 6 uses Sass modern API requiring canonicalize+load (not legacy importer function)
          importers: [{
            canonicalize (url: string) {
              if (url.startsWith('tailwindcss')) {
                return new URL('tailwindcss-stub:' + url)
              }
              return null
            },
            load (_canonicalUrl: URL) {
              return { contents: '', syntax: 'scss' as const }
            }
          }]
        }
      }
    }
  }
})
