// @vitest-environment nuxt
import { it, expect } from 'vitest'
import { mountSuspended } from 'vitest-environment-nuxt/utils'

import { BcrosInputsCountriesOfCitizenship, BcrosInputsCountriesOfCitizenshipDropdown } from '#components'

it('can mount BcrosInputsCountriesOfCitizenship component', async () => {
  const adr: BtrAddressI = {
    city: '',
    country: { alpha_2: 'CA', name: 'Canada' },
    line1: '',
    postalCode: '',
    region: ''
  }
  const component =
          await mountSuspended(BcrosInputsCountriesOfCitizenship, { props: { label: 'Test Address', id: 'testId', modelValue: adr } })
  expect(component.findComponent('#testId')).toBeTruthy()
  expect(component.text()).contains('Test Address')
  expect(component.text()).contains('Country')
})

it('can mount BcrosInputsCountriesOfCitizenshipDropdown component', async () => {
  const adr: BtrAddressI = {
    city: '',
    country: { alpha_2: 'CA', name: 'Canada' },
    line1: '',
    postalCode: '',
    region: ''
  }
  const component =
          await mountSuspended(BcrosInputsCountriesOfCitizenshipDropdown, { props: { label: 'Test Address', id: 'testId', modelValue: adr } })
  expect(component.findComponent('#testId')).toBeTruthy()
  expect(component.text()).contains('Test Address')
  expect(component.text()).contains('Country')
})
