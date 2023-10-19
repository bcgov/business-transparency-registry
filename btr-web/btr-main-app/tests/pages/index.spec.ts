import { expect, describe, test } from 'vitest'
import { mountSuspended } from 'vitest-environment-nuxt/utils'
import { createI18n } from 'vue-i18n'
import App from '~/app.vue'

const i18n = createI18n({
  // vue-i18n options here ...
})
describe('Tests for app.vue', () => {
  test('header and footer initialized', async () => {
    const wrapper = await mountSuspended(App, { global: { plugins: [i18n] } })
    expect(wrapper.find('#bcros-main-header').exists()).toBe(true)
    expect(wrapper.find('#bcros-main-footer').exists()).toBe(true)
    expect(wrapper.find('[data-cy="individualsSummaryTable"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="addIndividualPerson"]').exists()).toBe(true)
    expect(wrapper.find('THERE IS NO SUCH THING HERE').exists()).toBe(false)
  })
})
