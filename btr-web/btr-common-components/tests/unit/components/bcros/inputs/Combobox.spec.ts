// @vitest-environment nuxt
import { it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { createI18n } from 'vue-i18n'

import { BcrosInputsCombobox } from '#components'

const i18n = createI18n({
  // vue-i18n options here ...
})

it('can mount BcrosInputsCombobox component', async () => {
  const component = await mountSuspended(BcrosInputsCombobox, {
    global: { plugins: [i18n] },
    props: {
      name: 'testname',
      help: 'help',
      items: [],
      labelPlaceholder: 'labelPlaceholder',
      floatingLabel: 'floatingLabel',
      keyAttribute: 'key',
      searchAttributes: ['key']
    }
  })

  expect(component.find('[data-cy="testname.select"]').exists()).toBe(true)
  expect(component.find('[data-cy="testnameComboboxButton"]').exists()).toBe(true)
})
