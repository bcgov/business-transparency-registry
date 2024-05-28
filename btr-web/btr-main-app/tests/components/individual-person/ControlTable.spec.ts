import { expect, describe, it } from 'vitest'
import { VueWrapper, flushPromises } from '@vue/test-utils'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { mockedI18n } from '../../utils/mockedi18n'
import { testSI, testSI2 } from '../../utils/mockedData'
import { IndividualPersonControlTable } from '#components'

describe('AddIndividualPersonSummaryTable tests', () => {
  let wrapper: VueWrapper<any>
  const si1 = { ...testSI }
  const si2 = { ...testSI2 }

  beforeEach(async () => {
    wrapper = await mountSuspended(IndividualPersonControlTable, {
      props: { modelValue: [si1, si2], numberOfRows: 2 },
      global: { plugins: [mockedI18n] }
    })
    await flushPromises()
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('renders ControlTable with two individuals sharing controls', () => {
    expect(wrapper.find('[data-cy=individualsControlTable]').exists()).toBe(true)
    expect(wrapper.findAll('th').length).toBe(3)
    expect(wrapper.find('tbody').findAll('tr').length).toBe(2)
    expect(wrapper.findAll('th').at(0)?.text()).toBe('Name')
    expect(wrapper.findAll('th').at(1)?.text()).toBe('Control Type')
    expect(wrapper.findAll('th').at(2)?.text()).toBe('Individual Connection')

    expect(wrapper.find('[data-cy=control-table-name]').exists()).toBe(true)
    expect(wrapper.findAll('[data-cy=control-table-name]').length).toBe(2)
    expect(wrapper.find('[data-cy=control-table-individual-connection]').exists()).toBe(true)
    expect(wrapper.findAll('[data-cy=control-table-individual-connection]').length).toBe(2)
  })

  it('displays the Name column as expected', () => {
    expect(wrapper.findAll('[data-cy=control-table-name]').at(0)?.text()).toContain('NAME')
    expect(wrapper.findAll('[data-cy=control-table-name]').at(0)?.text()).toContain(si1.name.fullName.toUpperCase())
    expect(wrapper.findAll('[data-cy=control-table-name]').at(0)?.text()).toContain('Preferred name')
    expect(wrapper.findAll('[data-cy=control-table-name]').at(0)?.text()).toContain(si1.name.preferredName)
    expect(wrapper.findAll('[data-cy=control-table-name]').at(0)?.text()).toContain('Birth year')
    expect(wrapper.findAll('[data-cy=control-table-name]').at(0)?.text()).toContain(si1.birthDate.slice(0, 4))
  })

  it('renders ControlTable with one indviduals and a warning message', async () => {
    // update si1 so the person does not have any in-concert shares
    si1.sharesInConcert = []
    si1.controlOfShares.inConcertControl = false
    await wrapper.setProps({ individuals: [si1, si2], numberOfRows: 1 })
    expect(wrapper.find('[data-cy=individualsControlTable]').exists()).toBe(true)
    expect(wrapper.find('tbody').findAll('tr').length).toBe(2) // a row for si2 and another row for warning
    expect(wrapper.find('tbody').findAll('tr').at(0)?.html()).toContain('alertsMessage:alert')
  })

  // Note: The other two columns (control type and individual connection) are rendered dynamically and will be tested
  // using Cypress
})
