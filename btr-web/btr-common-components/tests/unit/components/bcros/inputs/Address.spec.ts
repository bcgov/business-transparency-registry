// @vitest-environment nuxt
import { it, expect } from 'vitest'
import { mountSuspended } from 'vitest-environment-nuxt/utils'

import { BcrosInputsAddress } from '#components'
import { BtrAddressI } from '~/interfaces/btr-address-i'

it('can mount BcrosInputsAddress component', async () => {
  const adr: BtrAddressI = {
    city: '',
    country: { alpha_2: 'CA', name: 'Canada' },
    line1: '',
    postalCode: '',
    region: ''
  }
  const component =
    await mountSuspended(BcrosInputsAddress, { props: { label: 'Test Address', id: 'testId', modelValue: adr } })
  expect(component.findComponent('#testId')).toBeTruthy()
  expect(component.text()).contains('Test Address')
  expect(component.text()).contains('Country')
})
