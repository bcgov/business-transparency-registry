import { expect, describe, test } from 'vitest'
import { VueWrapper, mount } from '@vue/test-utils'
import { mockedI18n } from '../utils/mockedi18n'
import myRegistriesDetails from '~/pages/myRegistriesDetails.vue'

describe('Tests for my registries details page', () => {
  let wrapper: VueWrapper<any>

  beforeEach(() => {
    wrapper = mount(myRegistriesDetails, { global: { plugins: [mockedI18n] } })
  })
  afterEach(() => { wrapper.unmount() })

  test('Contains all the expected elements', () => {
    expect(wrapper.find('[data-cy="myRegDetailsHeader"]').exists()).toBe(true)
    expect(wrapper.find('[data-cy="myRegDetailsHeaderSub"]').exists()).toBe(true)
    expect(wrapper.find('[data-cy="myRegDetailsSectionHeader"]').exists()).toBe(true)
    expect(wrapper.find('[data-cy="myRegDetailsTable"]').exists()).toBe(true)
  })
})
