// @vitest-environment nuxt
import { it, expect } from 'vitest'
import { mountSuspended } from 'vitest-environment-nuxt/utils'

import { BcrosWidgetsFee } from '#components'
import { FeesI } from '~/interfaces/fees-i'

it('can mount fees component', async () => {
  const fees: FeesI[] = [
    {
      amount: 0, name: '0 Charge - no fee'
    }, {
      amount: 12, name: '$12 fee'
    },
    {
      amount: 17.2, name: 'another fee'
    }]

  const total = 0 + 12 + 17.2

  const component = await mountSuspended(BcrosWidgetsFee, { props: { fees } })
  expect(component.findComponent('[data-cy="pay-fees-widget"]').exists()).toBe(true)
  expect(component.text()).toContain('$12.00')
  expect(component.text()).toContain('$17.20')
  expect(component.text()).toContain(`$${total}`)
})
