import { expect, describe, test } from 'vitest'
import { setup } from '@nuxt/test-utils'
import { mount } from '@vue/test-utils'
import LandingPage from '~/pages/index.vue'

describe('Tests for app.vue', async () => {
  await setup({
    // test context options
  })

  test('header and footer initialized', () => {
    const wrapper = mount(LandingPage)
    expect(wrapper.find('#bcros-main-header')).toBeTruthy()
    expect(wrapper.find('#bcros-main-footer')).toBeTruthy()
  })
})
