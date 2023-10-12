// @vitest-environment nuxt
import { describe, it, expect } from 'vitest'
import { VueWrapper, mount } from '@vue/test-utils'

import { BcrosDatePicker, BcrosInputsDateSelect } from '#components'

describe('DateSelect tests', () => {
  let wrapper: VueWrapper<any>

  beforeEach(() => { wrapper = mount(BcrosInputsDateSelect) })
  afterEach(() => { wrapper.unmount() })

  it('renders DateSelect', () => {
    // test everything renders
    expect(wrapper.findComponent(BcrosInputsDateSelect).exists()).toBe(true)
    expect(wrapper.find('.bcros-date-select').exists()).toBe(true)
    expect(wrapper.find('.bcros-date-select__btn').exists()).toBe(true)
    // datepicker should be hidden until select is clicked
    expect(wrapper.findComponent(BcrosDatePicker).exists()).toBe(false)
  })
})
