// @vitest-environment nuxt
import { it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'

import { BcrosInputsEmailField } from '#components'

it('can mount some component', async () => {
  const component = await mountSuspended(BcrosInputsEmailField, { props: { label: 'Test Email', id: 'testId' } })
  expect(component.findComponent('#testId')).toBeTruthy()
  expect(component.text()).toMatchInlineSnapshot('"Test Email"')
})
