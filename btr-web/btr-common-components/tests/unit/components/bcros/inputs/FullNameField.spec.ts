// @vitest-environment nuxt
import { it, expect } from 'vitest'
import { mountSuspended } from 'vitest-environment-nuxt/utils'

import { BcrosInputsFullNameField } from '#components'

it('can mount some component', async () => {
  const component = await mountSuspended(
    BcrosInputsFullNameField, { props: { label: 'Test Full Name', id: 'testId' } }
  )
  expect(component.findComponent('#testId')).toBeTruthy()
  expect(component.text()).toMatchInlineSnapshot('"Test Full Name"')
})
