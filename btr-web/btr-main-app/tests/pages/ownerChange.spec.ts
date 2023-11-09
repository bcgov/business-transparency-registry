import { expect, describe, test } from 'vitest'
import { VueWrapper, mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import en from '../../../btr-common-components/lang/en.json'
import ownerChange from '~/pages/ownerChange.vue'

const i18n = createI18n({
  locale: 'en',
  messages: { en }
})
describe('Tests for owner change page', () => {
  let wrapper: VueWrapper<any>

  beforeEach(() => {
    wrapper = mount(ownerChange, { global: { plugins: [i18n] } })
  })
  afterEach(() => { wrapper.unmount() })

  test('header and footer initialized', () => {
    expect(wrapper.find('[data-cy="individualsSummaryTable"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="addIndividualPerson"]').exists()).toBe(true)
    expect(wrapper.find('THERE IS NO SUCH THING HERE').exists()).toBe(false)
  })
})
