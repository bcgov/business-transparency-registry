import { expect, describe, test } from 'vitest'
import { VueWrapper, mount } from '@vue/test-utils'
import { mockedI18n } from '../utils/mockedi18n'
import reviewConfirm from '~/pages/reviewConfirm.vue'

describe('Tests for review and confirm page', () => {
  let wrapper: VueWrapper<any>

  beforeEach(() => {
    wrapper = mount(reviewConfirm, { global: { plugins: [mockedI18n] } })
  })
  afterEach(() => { wrapper.unmount() })

  test('Contains all the expected elements', () => {
    expect(wrapper.find('[data-cy="page-header"]').exists()).toBe(true)
    expect(wrapper.find('[data-cy="review-confirm-section-heading"]').exists()).toBe(true)
    expect(wrapper.find('[data-cy="effective-date-select"]').exists()).toBe(true)
    expect(wrapper.find('[data-cy="table-header"]').exists()).toBe(true)
    expect(wrapper.find('[data-cy="individualsSummaryTable"]').exists()).toBe(true)
    expect(wrapper.find('[data-cy="certify-section"]').exists()).toBe(true)
  })

  test('significantIndividualChangeFolioNumber is being displayed', () => {
    expect(wrapper.find('[data-cy=significantIndividualChangeFolioNumberLabel]').exists()).toBe(true)
    expect(wrapper.find('[data-cy=significantIndividualChangeFolioNumberTextArea]').exists()).toBe(true)
  })
})
