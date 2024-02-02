// @vitest-environment nuxt
import { it, expect } from 'vitest'
import { mountSuspended } from 'vitest-environment-nuxt/utils'
import { createI18n } from 'vue-i18n'
import { FormError } from '#ui/types'
import { BcrosInputsAddress } from '#components'
import { BtrAddressI } from '~/interfaces/btr-address-i'

const i18n = createI18n({})

it('can mount BcrosInputsAddress component', async () => {
  const adr: BtrAddressI = {
    city: '',
    country: { alpha_2: 'CA', name: 'Canada' },
    line1: '',
    postalCode: '',
    region: ''
  }
  const validationErrors: FormError[] = []

  const component =
    await mountSuspended(BcrosInputsAddress, {
      global: { plugins: [i18n] },
      props: { label: 'Test Address', id: 'testId', modelValue: adr, errors: validationErrors }
    })
  expect(component.findComponent('#testId')).toBeTruthy()
  expect(component.text()).contains('Test Address')
  expect(component.text()).contains('Canada')
})
