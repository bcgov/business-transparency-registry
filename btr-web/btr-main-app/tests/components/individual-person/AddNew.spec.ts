import { describe, it, expect } from 'vitest'
import { VueWrapper, flushPromises, mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'

import { AddIndividualPerson, BcrosInputsDateSelect } from '#components'

const i18n = createI18n({
  // vue-i18n options here ...
})
describe('AddIndividualPerson tests', () => {
  let wrapper: VueWrapper<any>

  beforeEach(() => {
    wrapper = mount(AddIndividualPerson, { global: { plugins: [i18n] } })
  })
  afterEach(() => {
    wrapper.unmount()
  })

  it('renders AddIndividualPerson', () => {
    // test everything renders
    expect(wrapper.findComponent(AddIndividualPerson).exists()).toBe(true)
    // FUTURE: add in other pieces
    // add manually should be false
    expect(wrapper.vm.showAddInfoManually).toBe(false)
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
    expect(wrapper.vm.birthdate).toBe(newDate)
  })
})
