// @vitest-environment nuxt
import { it, expect } from 'vitest'
import { mountSuspended } from 'vitest-environment-nuxt/utils'

import { BcrosInputsPreferredNameField } from '#components'

it('can mount some component', async () => {
  const component = await mountSuspended(
    BcrosInputsPreferredNameField, { props: { label: 'Test Preferred Name', id: 'testId' } }
  )
  expect(component.findComponent('#testId')).toBeTruthy()
  expect(component.text()).toMatchInlineSnapshot('"Test Preferred Name"')
})
