// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  components: [
    {
      path: '~/components', // will get any components nested in let's say /components/test too
      pathPrefix: false,
      global: true
    }
  ],
  typescript: {
    strict: true,
    includeWorkspace: true
  },
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/eslint-module',
    '@nuxtjs/i18n',
    '@nuxtjs/stylelint-module',
    '@nuxtjs/tailwindcss',
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
  }
})
