// @vitest-environment nuxt
import { it, expect } from 'vitest'
import { BcrosEmailField } from '#components'
import { mountSuspended } from 'vitest-environment-nuxt/utils'

it('can mount some component', async () => {
  const component = await mountSuspended(BcrosEmailField, {props: { label: 'Test Email', id: 'testId'}})
  expect(component.findComponent('#testId')).toBeTruthy()
  expect(component.text()).toMatchInlineSnapshot('"Test Email"')
})
