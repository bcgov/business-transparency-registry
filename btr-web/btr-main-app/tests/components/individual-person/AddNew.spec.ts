import { describe, it, expect } from 'vitest'
import { VueWrapper, flushPromises } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { mountSuspended } from 'vitest-environment-nuxt/utils'

import { IndividualPersonAddNew, BcrosInputsDateSelect, BcrosInputsAddress } from '#components'

const i18n = createI18n({
  // vue-i18n options here ...
})
describe('AddIndividualPerson tests', () => {
  let wrapper: VueWrapper<any>

  beforeEach(async () => {
    wrapper = await mountSuspended(IndividualPersonAddNew, { global: { plugins: [i18n] } })
  })
  afterEach(() => {
    wrapper.unmount()
  })

  it('renders AddIndividualPerson', () => {
    // test everything renders
    expect(wrapper.find('[data-test="addIndividualPerson"]').exists()).toBe(true)
    // FUTURE: add in other pieces
    // add manually should be false
    expect(wrapper.find('#add-person-manually-toggle').text()).toBe('Add transparency register information manually')
    // birthdate should be hidden
    expect(wrapper.findComponent(BcrosInputsDateSelect).exists()).toBe(false)
  })
  it('saves date selection', async () => {
    // toggle add manually
    await wrapper.find('#add-person-manually-toggle').trigger('click')
    await flushPromises()
    expect(wrapper.findComponent(BcrosInputsDateSelect).exists()).toBe(true)
    const newDate = new Date('2021-04-24T12:30:00')
    wrapper.findComponent(BcrosInputsDateSelect).vm.$emit('selection', newDate)
    await flushPromises()
    // FUTURE: replace this with cypress test
    // expect(wrapper.vm.birthdate).toBe(newDate)
  })

  it('renders the address component', async () => {
    await wrapper.find('#add-person-manually-toggle').trigger('click')
    await flushPromises()
    expect(wrapper.findComponent(BcrosInputsAddress).exists()).toBe(true)

    expect(wrapper.find('[data-cy="address-country"]').exists()).toBe(true)
    expect(wrapper.find('[data-cy="address-line1-autocomplete"]').exists()).toBe(true)
    expect(wrapper.find('[data-cy="address-line2"]').exists()).toBe(true)
    expect(wrapper.find('[data-cy="address-city"]').exists()).toBe(true)
    expect(wrapper.find('[data-cy="address-region-input"]').exists()).toBe(true)
    expect(wrapper.find('[data-cy="address-postal-code"]').exists()).toBe(true)
    expect(wrapper.find('[data-cy="address-location-description"]').exists()).toBe(true)
  })
})
