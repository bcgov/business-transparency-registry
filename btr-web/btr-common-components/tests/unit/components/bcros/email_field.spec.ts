import { expect, describe, test } from 'vitest'
import { setup } from '@nuxt/test-utils'
import { mount } from '@vue/test-utils'
import EmailField from '~/components/bcros/EmailField.vue'

describe('Tests for app.vue', async () => {
  await setup({
    // test context options
  })

  test('header and footer initialized', () => {
    const wrapper = mount(EmailField, { context: { label: 'testEmailFieldLbl', id: 'testEmailFieldId' } })
    expect(wrapper.find('#testEmailFieldId')).toBeTruthy()
    expect(wrapper.find('testEmailFieldLbl')).toBeTruthy()
  })
})
