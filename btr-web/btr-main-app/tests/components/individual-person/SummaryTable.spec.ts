import { expect, describe, it } from 'vitest'
import { VueWrapper, flushPromises } from '@vue/test-utils'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { mockedI18n } from '../../utils/mockedi18n'
import { testSI } from '../../utils/mockedData'
import { IndividualPersonSummaryTable } from '#components'

describe('AddIndividualPersonSummaryTable tests', () => {
  let wrapper: VueWrapper<any>
  const si = { ...testSI }

  beforeEach(async () => {
    wrapper = await mountSuspended(IndividualPersonSummaryTable, {
      props: { individuals: [], edit: true },
      global: { plugins: [mockedI18n] }
    })
    await flushPromises()
  })
  afterEach(() => {
    wrapper.unmount()
  })

  it('renders SummaryTable with no data provided', () => {
    const summaryTable = wrapper.find('[data-cy=individualsSummaryTable]')
    expect(summaryTable.exists()).toBe(true)
    expect(summaryTable.findAll('th').length).toBe(4)
    expect(summaryTable.findAll('th').at(0)?.text()).toBe('Name')
    expect(summaryTable.findAll('th').at(1)?.text()).toBe('Details')
    expect(summaryTable.findAll('th').at(2)?.text()).toBe('Control')
    expect(summaryTable.findAll('th').at(3)?.text()).toBe('Effective Dates')
    expect(summaryTable.findAll('td').length).toBe(1)
    expect(summaryTable.find('td').text()).toBe('You have no Significant individuals listed')
    expect(wrapper.find('[data-cy=summary-table-name]').exists()).toBe(false)
    expect(wrapper.find('[data-cy=summary-table-details]').exists()).toBe(false)
    expect(wrapper.find('[data-cy=summary-table-controls]').exists()).toBe(false)
    expect(wrapper.find('[data-cy=summary-table-dates]').exists()).toBe(false)
    expect(wrapper.find('[data-cy=summary-table-buttons]').exists()).toBe(false)
  })
  it('updates SummaryTable with data dynamically', async () => {
    await wrapper.setProps({ individuals: [si] })
    expect(wrapper.find('[data-cy=individualsSummaryTable] tbody tr').findAll('td').length).toBe(5)
    expect(wrapper.find('[data-cy=summary-table-name]').exists()).toBe(true)
    expect(wrapper.find('[data-cy=summary-table-details]').exists()).toBe(true)
    expect(wrapper.find('[data-cy=summary-table-controls]').exists()).toBe(true)
    expect(wrapper.find('[data-cy=summary-table-dates]').exists()).toBe(true)
    expect(wrapper.find('[data-cy=summary-table-buttons]').exists()).toBe(true)
  })
  it('displays the Name column as expected', async () => {
    si.name.fullName = 'full name'
    si.name.preferredName = 'preferred name'
    si.email = 'test@email.com'
    await wrapper.setProps({ individuals: [si] })
    expect(wrapper.find('[data-cy=summary-table-name]').text()).toContain(si.name.fullName.toUpperCase())
    expect(wrapper.find('[data-cy=summary-table-name]').text()).toContain(si.name.preferredName)
    expect(wrapper.find('[data-cy=summary-table-name]').text()).toContain(si.birthDate)
  })
  it('displays the Details column as expected', async () => {
    await wrapper.setProps({ individuals: [si] })
    const details = wrapper.find('[data-cy=summary-table-details]')
    expect(details.text()).toContain(si.email)
    expect(details.text()).toContain(si.address.line1)
    expect(details.text()).toContain(si.address.city)
    expect(details.text()).toContain(si.address.region)
    expect(details.text()).toContain(si.address.postalCode)
    expect(details.text()).toContain('Tax Residency')
    expect(details.text()).toContain('Canada')
  })
  // To-Do: update this test to reflect the content of control column in the new summary table in #21656
  it('displays the Controls column as expected', async () => {
    si.controlOfVotes.registeredOwner = true
    si.controlOfVotes.beneficialOwner = true
    si.controlOfVotes.indirectControl = true
    si.controlOfVotes.inConcertControl = true
    si.controlOfVotes.percentage = PercentageRangeE.AT_LEAST_25_TO_50
    si.controlOfShares.registeredOwner = true
    si.controlOfShares.beneficialOwner = true
    si.controlOfShares.indirectControl = true
    si.controlOfShares.inConcertControl = true
    si.controlOfShares.percentage = PercentageRangeE.MORE_THAN_50_TO_75
    si.controlOfDirectors.directControl = false
    si.controlOfDirectors.indirectControl = false
    si.controlOfDirectors.significantInfluence = false
    si.controlOfDirectors.inConcertControl = false
    si.controlOther = ''
    await wrapper.setProps({ individuals: [si] })
    const controls = wrapper.find('[data-cy=summary-table-controls]')
    expect(controls.text()).toContain('Shares')
    expect(controls.text()).toContain('Votes')
    expect(controls.text()).toContain('Registered owner, Beneficial owner, and Indirect control')
    expect(controls.text()).toContain('At least 25% and up to 50% of votes')
    expect(controls.text()).toContain('More than 50% and up to 75% of shares')
    expect(controls.text()).not.toContain('Directors')
    expect(controls.text()).not.toContain('Other')
  })
})
