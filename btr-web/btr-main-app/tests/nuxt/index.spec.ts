import { expect, describe, test } from 'vitest'
import LandingPage from '~/pages/index.vue'
import { mountSuspended } from 'vitest-environment-nuxt/utils'

describe('Tests for app.vue', async () => {

  test('header and footer initialized', async () => {
    const wrapper = await mountSuspended(LandingPage)
    expect(wrapper.find('#bcros-main-header')).toBeTruthy()
    expect(wrapper.find('#bcros-main-footer')).toBeTruthy()
  })
})
