// @vitest-environment nuxt
import { it, expect } from 'vitest'
import { mountSuspended } from 'vitest-environment-nuxt/utils'
import { createI18n } from 'vue-i18n'

import { BcrosAlertsMessage } from '#components'

const i18n = createI18n({
  // vue-i18n options here ...
})

it('can mount BcrosAlertsMessage component', async () => {
  const alert = await mountSuspended(BcrosAlertsMessage,
    { global: { plugins: [i18n] }, props: { flavour: AlertsFlavourE.ALERT } })
  expect(alert.find('[data-cy="alertsMessage:alert"]').exists()).toBe(true)
  const success = await mountSuspended(BcrosAlertsMessage,
    { global: { plugins: [i18n] }, props: { flavour: AlertsFlavourE.SUCCESS } })
  expect(success.find('[data-cy="alertsMessage:success"]').exists()).toBe(true)
  const warning = await mountSuspended(BcrosAlertsMessage,
    { global: { plugins: [i18n] }, props: { flavour: AlertsFlavourE.WARNING } })
  expect(warning.find('[data-cy="alertsMessage:warning"]').exists()).toBe(true)
  const message = await mountSuspended(BcrosAlertsMessage,
    { global: { plugins: [i18n] }, props: { flavour: AlertsFlavourE.MESSAGE } })
  expect(message.find('[data-cy="alertsMessage:message"]').exists()).toBe(true)
  const info = await mountSuspended(BcrosAlertsMessage,
    { global: { plugins: [i18n] }, props: { flavour: AlertsFlavourE.INFO } })
  expect(info.find('[data-cy="alertsMessage:info"]').exists()).toBe(true)
})
