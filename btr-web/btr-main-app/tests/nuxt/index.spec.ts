import { expect, describe, test } from 'vitest'
import { mountSuspended } from 'vitest-environment-nuxt/utils'

import LandingPage from '~/pages/index.vue'

describe('Tests for app.vue', () => {
  test('header and footer initialized', async () => {
    const wrapper = await mountSuspended(LandingPage)
    expect(wrapper.find('#bcros-main-header')).toBeTruthy()
    expect(wrapper.find('#bcros-main-footer')).toBeTruthy()
  })
})
