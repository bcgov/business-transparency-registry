import { describe, expect, it, vi } from 'vitest'
import { VueWrapper, mount } from '@vue/test-utils'

import { BcrosButtonControl } from '#components'

describe('Button Control tests', () => {
  let wrapper: VueWrapper<any>

  const leftBtnActions = [
    vi.fn().mockImplementation(() => {}),
    vi.fn().mockImplementation(() => {}),
    vi.fn().mockImplementation(() => {})
  ]
  const rightBtnActions = [vi.fn().mockImplementation(() => {}), vi.fn().mockImplementation(() => {})]

  const leftButtons: ButtonControlI[] = [
    { action: leftBtnActions[0], label: 'left 1' },
    { action: leftBtnActions[1], label: 'left 2' },
    { action: leftBtnActions[2], label: 'left 3' }
  ]

  const rightButtons: ButtonControlI[] = [
    { action: rightBtnActions[0], label: 'right 1' },
    { action: rightBtnActions[1], label: 'right 2' }
  ]

  beforeEach(() => {
    wrapper = mount(
      BcrosButtonControl,
      {
        props: {
          leftButtonConstructors: leftButtons.map(btn => () => btn),
          rightButtonConstructors: rightButtons.map(btn => () => btn)
        }
      })
  })
  afterEach(() => {
    wrapper.unmount()
    vi.clearAllMocks()
  })

  it('renders with expected buttons / behaviour', async () => {
    expect(wrapper.find('#bcros-button-control').exists()).toBe(true)

    const renderedLeftBtns = wrapper.findAll('[data-cy=button-control-left-button]')
    const renderedRightBtns = wrapper.findAll('[data-cy=button-control-right-button]')
    expect(renderedLeftBtns.length).toBe(leftButtons.length)
    expect(renderedRightBtns.length).toBe(rightButtons.length)

    for (let i = 0; i < leftButtons.length; i++) {
      expect(renderedLeftBtns.at(i)?.text()).toBe(leftButtons[i].label)
      expect(leftBtnActions[i]).not.toHaveBeenCalled()
      await renderedLeftBtns.at(i)?.trigger('click')
      expect(leftBtnActions[i]).toHaveBeenCalled()
    }

    for (let i = 0; i < rightButtons.length; i++) {
      expect(renderedRightBtns.at(i)?.text()).toBe(rightButtons[i].label)
      expect(rightBtnActions[i]).not.toHaveBeenCalled()
      await renderedRightBtns.at(i)?.trigger('click')
      expect(rightBtnActions[i]).toHaveBeenCalled()
    }
  })
})
