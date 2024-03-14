import { expect, describe, test } from 'vitest'
import { VueWrapper } from '@vue/test-utils'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { mockedI18n } from '../../btr-common-components/tests/unit/utils/mockedi18n'
import app from '~/app.vue'

describe('Tests for owner change page', () => {
  let wrapper: VueWrapper<any>

  beforeEach(async () => {
    wrapper = await mountSuspended(app, { global: { plugins: [mockedI18n] } })
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
