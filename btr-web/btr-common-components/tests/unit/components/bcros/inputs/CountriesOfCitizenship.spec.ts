// @vitest-environment nuxt
import { it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { createI18n } from 'vue-i18n'
import { FormError } from '#ui/types'

import { BcrosInputsCountriesOfCitizenship, BcrosInputsCountriesOfCitizenshipDropdown } from '#components'

const i18n = createI18n({
  // vue-i18n options here ...
})

it('can mount BcrosInputsCountriesOfCitizenship component', async () => {
  const validationErrors: FormError[] = []
  const component = await mountSuspended(BcrosInputsCountriesOfCitizenship,
    { global: { plugins: [i18n] }, props: { citizenships: [], errors: validationErrors } })
  expect(component.find('[data-cy="countryOfCitizenshipRadioGroup"]').exists()).toBe(true)
  expect(component.find('[data-cy="countryOfCitizenshipDropdown"]').exists()).toBe(true)
  expect(component.find('[data-cy="countryOfCitizenshipDropdownButton"]').exists()).toBe(true)
})

it('can mount BcrosInputsCountriesOfCitizenshipDropdown component', async () => {
  const component = await mountSuspended(BcrosInputsCountriesOfCitizenshipDropdown,
    { props: { modelValue: [], placeholder: 'Hold the door!', disabled: false } })
  expect(component.findComponent('[data-cy="countryOfCitizenshipDropdown"]').exists()).toBe(true)
  expect(
    component.findComponent('[data-cy="countryOfCitizenshipDropdown"] > button')
      .attributes()
      .disabled
  ).toBeUndefined()
})

it('can mount BcrosInputsCountriesOfCitizenshipDropdown component, it is disabled', async () => {
  const component = await mountSuspended(BcrosInputsCountriesOfCitizenshipDropdown,
    { props: { modelValue: [], placeholder: 'HODOR!', disabled: true } })
  expect(component.findComponent('[data-cy="countryOfCitizenshipDropdown"] > button').exists()).toBe(true)
  expect(
    component.findComponent('[data-cy="countryOfCitizenshipDropdown"] > button')
      .attributes()
      .disabled
  ).toBeDefined()
})
