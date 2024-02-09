// @vitest-environment nuxt
import { describe, it, expect } from 'vitest'
import { VueWrapper, flushPromises } from '@vue/test-utils'
import { mountSuspended } from 'vitest-environment-nuxt/utils'

import { BcrosDatePicker, BcrosInputsDateSelect } from '#components'

describe('DateSelect tests', () => {
  let wrapper: VueWrapper<any>

  beforeEach(async () => { wrapper = await mountSuspended(BcrosInputsDateSelect) })
  afterEach(() => { wrapper.unmount() })

  it('renders DateSelect', () => {
    // test everything renders
    expect(wrapper.find('[data-cy=date-select]').exists()).toBe(true)
    // datepicker should be hidden until select is clicked
    expect(wrapper.findComponent(BcrosDatePicker).exists()).toBe(false)
  })
  it('allows / emits date selection with predicted functionality', async () => {
    expect(wrapper.findComponent(BcrosDatePicker).exists()).toBe(false)
    // click select
    wrapper.find('[data-cy=date-select]').trigger('click')
    await flushPromises()
    // verify datepicker is showing
    expect(wrapper.findComponent(BcrosDatePicker).exists()).toBe(true)
    // verify nothing selected date has NOT been emitted yet
    expect(wrapper.emitted('selectedDate')).toBeUndefined()
    // emit selection
    const selectedDate = new Date('2022-04-24T12:30:00')
    wrapper.findComponent(BcrosDatePicker).vm.$emit('selected-date', selectedDate)
    await flushPromises()
    // verify emit
    const selectionEmit = wrapper.emitted('selection') || []
    expect(selectionEmit?.length).toBe(1)
    expect(selectionEmit[0]).toEqual([selectedDate])
    // verfify datepicker is hidden
    expect(wrapper.findComponent(BcrosDatePicker).exists()).toBe(false)
  })
})
