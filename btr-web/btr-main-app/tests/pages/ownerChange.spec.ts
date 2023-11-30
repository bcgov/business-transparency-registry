import { expect, describe, test } from 'vitest'
import { VueWrapper, mount } from '@vue/test-utils'
import { mockedI18n } from '../utils/mockedi18n'
import ownerChange from '~/pages/ownerChange.vue'

describe('Tests for owner change page', () => {
  let wrapper: VueWrapper<any>

  beforeEach(() => {
    wrapper = mount(ownerChange, { global: { plugins: [mockedI18n] } })
  })
  afterEach(() => { wrapper.unmount() })

  test('header and footer initialized', () => {
    expect(wrapper.find('[data-cy="individualsSummaryTable"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="addIndividualPerson"]').exists()).toBe(true)
    expect(wrapper.find('THERE IS NO SUCH THING HERE').exists()).toBe(false)
  })
})
