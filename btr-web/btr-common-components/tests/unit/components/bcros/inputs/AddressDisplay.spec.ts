// @vitest-environment nuxt
import { expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { BcrosInputsAddressDisplay } from '#components'
import { BtrAddressI } from '~/interfaces/btr-address-i'

it('mounts the BcrosInputsAddressDisplay component and renders the correct values', () => {
  const address: BtrAddressI = {
    city: 'Victoria',
    country: { alpha_2: 'CA', name: 'Canada' },
    line1: '123 Fake street',
    line2: '566',
    postalCode: 'V1P 4T6',
    region: 'BC'
  }
  const wrapper = mount(BcrosInputsAddressDisplay, { props: { modelValue: address } })
  expect(wrapper.find('[data-cy=address-display]').exists()).toBe(true)
  expect(wrapper.find('[data-cy=address-display]').text()).toContain(address.line1)
  expect(wrapper.find('[data-cy=address-display]').text()).toContain(address.line2)
  expect(wrapper.find('[data-cy=address-display]').text()).toContain(address.city)
  expect(wrapper.find('[data-cy=address-display]').text()).toContain(address.region)
  expect(wrapper.find('[data-cy=address-display]').text()).toContain(address.postalCode)
  expect(wrapper.find('[data-cy=address-display]').text()).toContain(address.country.name)
  wrapper.unmount()
})
