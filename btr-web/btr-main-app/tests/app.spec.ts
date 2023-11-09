import { expect, describe, test, vi } from 'vitest'
import { VueWrapper, mount } from '@vue/test-utils'
import { mountSuspended } from 'vitest-environment-nuxt/utils'
import { createI18n } from 'vue-i18n'
import { RouterHistory, RouteLocation, RouteLocationNormalized, useRoute, createRouter, createWebHistory } from 'vue-router'
import en from '../../btr-common-components/lang/en.json'
import app from '~/app.vue'
import ownerChange from '~/pages/ownerChange.vue'
import { RouteNameE } from '~/enums/route-name-e'
import routes from '~/app/router.options'

const i18n = createI18n({
  locale: 'en',
  messages: { en }
})
describe('Tests for owner change page', () => {
  let wrapper: VueWrapper<any>

  beforeEach(async () => {
    wrapper = await mountSuspended(app, { global: { plugins: [i18n] } })
  })
  afterEach(() => { wrapper.unmount() })

  test('app initializes with layouts and default page', () => {
    expect(wrapper.find('#bcros-main-header').exists()).toBe(true)
    expect(wrapper.find('#bcros-breadcrumb').exists()).toBe(true)
    expect(wrapper.find('[data-cy="crumb-back"]').exists()).toBe(true)
    // reg dash, my bus reg, bus name, ben own chng -- tested further in cypress
    expect(wrapper.findAll('[data-cy="crumb-link"]').length).toBe(4)
    expect(wrapper.find('#bcros-main-footer').exists()).toBe(true)
  })
})
