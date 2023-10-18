import { expect, describe, test } from 'vitest'
import { mountSuspended } from 'vitest-environment-nuxt/utils'

import LandingPage from '~/pages/index.vue'

import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  // vue-i18n options here ...
})
describe('Tests for app.vue', () => {
  test('header and footer initialized', async () => {
    const wrapper = await mountSuspended(LandingPage, { global: { plugins: [i18n] } })
    expect(wrapper.find('#bcros-main-header')).toBeTruthy()
    expect(wrapper.find('#bcros-main-footer')).toBeTruthy()
  })
})
