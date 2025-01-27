import { describe, it, expect } from 'vitest'
import { VueWrapper, flushPromises } from '@vue/test-utils'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { mockedI18n } from '../../utils/mockedi18n'

import {
  IndividualPersonAddNew,
  BcrosInputsDateSelect,
  BcrosInputsAddress,
  IndividualPersonTaxInfoTaxNumber,
  IndividualPersonTaxInfoTaxResidency,
  IndividualPersonControlOfDirectors,
  IndividualPersonControlOfSharesVotes
} from '#components'

describe('AddIndividualPerson tests', () => {
  let wrapper: VueWrapper<any>

  beforeEach(async () => {
    wrapper = await mountSuspended(IndividualPersonAddNew, { global: { plugins: [mockedI18n] } })
  })
  afterEach(() => {
    wrapper.unmount()
  })

  it('renders AddIndividualPerson', () => {
    // test everything renders
    expect(wrapper.find('[data-cy="addIndividualPerson"]').exists()).toBe(true)
    // FUTURE: add in other pieces
    // NB: may be added back in
    // expect(wrapper.find('#add-person-manually-toggle').text()).toBe('Add transparency register information manually')
    // birthdate should be hidden
    // expect(wrapper.findComponent(BcrosInputsDateSelect).exists()).toBe(false)
  })
  it('saves date selection', async () => {
    // toggle add manually
    // await wrapper.find('#add-person-manually-toggle').trigger('click')
    // await flushPromises()
    expect(wrapper.findComponent(BcrosInputsDateSelect).exists()).toBe(true)
    const newDate = new Date('2021-04-24T12:30:00')
    wrapper.findComponent(BcrosInputsDateSelect).vm.$emit('selection', newDate)
    await flushPromises()
    // FUTURE: replace this with cypress test
    // expect(wrapper.vm.birthdate).toBe(newDate)
  })

  it('renders the address component', () => {
    // await wrapper.find('#add-person-manually-toggle').trigger('click')
    // await flushPromises()
    expect(wrapper.findComponent(BcrosInputsAddress).exists()).toBe(true)

    expect(wrapper.find('[data-cy="address-country"]').exists()).toBe(true)
    expect(wrapper.find('[data-cy="address-line1-autocomplete"]').exists()).toBe(true)
    expect(wrapper.find('[data-cy="address-line2"]').exists()).toBe(true)
    expect(wrapper.find('[data-cy="address-city"]').exists()).toBe(true)
    expect(wrapper.find('[data-cy="address-region-input"]').exists()).toBe(true)
    expect(wrapper.find('[data-cy="address-postal-code"]').exists()).toBe(true)
    expect(wrapper.find('[data-cy="address-location-description"]').exists()).toBe(true)
  })

  it('renders the control of shares and votes', () => {
    // await wrapper.find('#add-person-manually-toggle').trigger('click')
    // await flushPromises()
    expect(wrapper.findComponent(IndividualPersonControlOfSharesVotes).exists()).toBe(true)
  })

  it('renders the control of majority of directors', () => {
    // await wrapper.find('#add-person-manually-toggle').trigger('click')
    // await flushPromises()
    expect(wrapper.findComponent(IndividualPersonControlOfDirectors).exists()).toBe(true)
  })

  it('renders the tax number component', () => {
    // await wrapper.find('#add-person-manually-toggle').trigger('click')
    // await flushPromises()
    expect(wrapper.findComponent(IndividualPersonTaxInfoTaxNumber).exists()).toBe(true)
  })

  it('renders the tax residency component', () => {
    // await wrapper.find('#add-person-manually-toggle').trigger('click')
    // await flushPromises()
    expect(wrapper.findComponent(IndividualPersonTaxInfoTaxResidency).exists()).toBe(true)
  })

  it('renders the isUnableToObtainOrConfirmInformation section and all details', () => {
    // await wrapper.find('#add-person-manually-toggle').trigger('click')
    // await flushPromises()

    // find section div
    expect(wrapper.find('[data-cy="isUnableToObtainOrConfirmInformation"]').exists()).toBe(true)
  })
})
