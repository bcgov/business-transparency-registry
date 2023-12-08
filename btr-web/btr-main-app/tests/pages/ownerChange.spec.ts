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
    expect(wrapper.find('[data-cy=page-header]').exists()).toBe(true)
    expect(wrapper.find('[data-cy=page-info-text]').exists()).toBe(true)
    expect(wrapper.find('[data-cy=effective-date-select]').exists()).toBe(true)
    expect(wrapper.find('[data-cy=add-new-btn]').exists()).toBe(true)
    expect(wrapper.find('[data-cy="individualsSummaryTable"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="addIndividualPerson"]').exists()).toBe(false)
    expect(wrapper.find('THERE IS NO SUCH THING HERE').exists()).toBe(false)
  })

  test('significantIndividualChangeFolioNumber is being displayed', () => {
    expect(wrapper.find('[data-cy=significantIndividualChangeFolioNumber]').exists()).toBe(true)
  })
})
