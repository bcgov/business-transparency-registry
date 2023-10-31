// @vitest-environment nuxt
import { it, expect } from 'vitest'
import { mountSuspended } from 'vitest-environment-nuxt/utils'

import { BcrosInputsNameField } from '#components'

it('can mount some component', async () => {
  const component = await mountSuspended(
    BcrosInputsNameField, { props: { label: 'Test Full Name', id: 'testId', name: 'fullName' } }
  )
  expect(component.findComponent('#testId')).toBeTruthy()
  expect(component.text()).toMatchInlineSnapshot('"Test Full Name"')
  expect(component.html()).toContain('fullName')
})
