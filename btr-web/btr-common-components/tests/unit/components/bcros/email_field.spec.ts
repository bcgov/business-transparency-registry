import { expect, describe, test } from 'vitest'
import { setup } from '@nuxt/test-utils'
import { mount } from '@vue/test-utils'
import EmailField from '~/components/bcros/EmailField.vue'

describe('Tests for app.vue', async () => {
  await setup({
    // test context options
  })

  test('header and footer initialized', () => {
    const wrapper = mount(EmailField)
    expect(wrapper.find('#bcros-main-header')).toBeTruthy()
    expect(wrapper.find('#bcros-main-footer')).toBeTruthy()
  })
})
