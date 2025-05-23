// @vitest-environment nuxt
import { it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'

import { BcrosWidgetsFee } from '#components'
import type { FeeInfoI } from '~/interfaces/fees-i'

it('can mount fees component', async () => {
  const fees: FeeInfoI[] = [
    {
      filingTypeCode: 'REGSIGIN',
      total: 12
    },
    {
      filingTypeCode: 'REGSIGIN1',
      total: 17.2
    }
  ]

  const total = 0 + 12 + 17.2

  const component = await mountSuspended(BcrosWidgetsFee, { props: { fees } })
  expect(component.findComponent('[data-cy="pay-fees-widget"]').exists()).toBe(true)
  expect(component.text()).toContain('$12.00')
  expect(component.text()).toContain('$17.20')
  expect(component.text()).toContain(`$${total}`)
})
