// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-16',
  ssr: false,
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
    '@nuxt/test-utils/module'
  ],
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
      version: process.env.npm_package_version || ''
    }
  },
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
