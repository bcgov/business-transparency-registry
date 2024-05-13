import moment from 'moment'
import { dateToString } from '../../../../btr-common-components/utils/date'

describe('pages -> Beneficial Owner Change', () => {
  beforeEach(() => {
    cy.visitHomePageWithFakeData()
  })

  it('redirected to owner change page', () => {
    // NOTE: this will change when we design a landing page. Once that happens change the cy.visit('/') ^
    cy.url().should('include', '/BC0871427/beneficial-owner-change')
  })

  it('rendered expected information', () => {
    cy.get('[data-cy=page-header]').should('have.text', 'Significant Individual Change')
    cy.get('[data-cy=page-info-text]').should('contain.text', 'Select the date of your significant')
    cy.get('[data-cy=effective-date-select]').should('have.text', 'Significant Individual Filing Effective Date')
    cy.get('[data-cy=add-new-btn]').should('have.text', 'Add an Individual')
    cy.get('[data-cy=addIndividualPerson]').should('not.exist')
    cy.get('[data-cy="individualsSummaryTable"]').should('exist')
  })

  it('allows selection of the effective date', () => {
    cy.get('[data-cy=date-select]').should('exist')
    cy.get('[data-cy=date-picker]').should('not.exist')
    cy.get('[data-cy=date-select]').trigger('click')
    cy.get('[data-cy=date-picker]').should('exist')
    cy.get('[data-cy=date-picker]').get('.bcros-date-picker__calendar__day').should('exist')
    cy.get('[data-cy=date-picker]').get('.bcros-date-picker__calendar__day').eq(0).trigger('click')

    const today = new Date()
    const year = today.getFullYear()
    const monty = today.getMonth()
    const day = 1
    const expectedDate = moment(new Date(year, monty, day)).format('YYYY-MM-DD')
    cy.get('[data-cy=date-select]').should('have.value', expectedDate)
  })

  it('expands add individual component when add individual button is clicked', () => {
    cy.get('[data-cy=add-new-btn]').trigger('click')
    cy.get('[data-cy=addIndividualPerson]').should('exist')
    cy.get('[data-cy=testFullName]').should('exist')
    cy.get('[data-cy=usePreferredName').should('exist')
    cy.get('[data-cy=testEmail]').should('exist')
    // cy.get('[data-cy=showAddIndividualPersonManually]')
    //   .should('have.text', ' Add transparency register information manually')
    // cy.get('[data-cy=addIndividualPerson]').should('contain.text', 'Assesment of Individual Significance')
    cy.get('[data-cy=new-si-cancel-btn]').should('have.text', 'Cancel')
    cy.get('[data-cy=new-si-done-btn]').should('have.text', 'Done')
    // should disable add button while add individual is expanded
    cy.get('[data-cy=add-new-btn]').should('have.attr', 'disabled')
  })

  it('click the checkbox to hide or show preferred name section', () => {
    cy.get('[data-cy=add-new-btn]').trigger('click')
    cy.get('[data-cy=usePreferredName').should('exist')
    cy.get('[data-cy=testPreferredName').should('not.exist')
    cy.get('[data-cy=usePreferredName').check()
    cy.get('[data-cy=testPreferredName').should('exist')
    cy.get('#individual-person-preferred-name').type('test preferred name')
    cy.get('[data-cy=usePreferredName').uncheck()
    cy.get('[data-cy=usePreferredName').check()
    cy.get('#individual-person-preferred-name').should('not.have.value', 'test preferred name')
  })

  it('expands all parts when manual entry clicked', () => {
    cy.get('[data-cy=add-new-btn]').trigger('click')

    // cy.get('[data-cy=showAddIndividualPersonManually]').trigger('click')
    // cy.get('[data-cy=showAddIndividualPersonManually]')
    //   .should('have.text', ' Cancel transparent register information')

    //todo: introduce langague files for this, and verify it works for correct fields
    // cy.get('[data-cy=addIndividualPerson]').should('contain.text', 'Assesment of Individual Significance')
    cy.get('[data-cy=addIndividualPerson]').should('contain.text', 'Control of Shares')
    cy.get('[data-cy=addIndividualPerson]').should('contain.text', 'Control of Votes')
    cy.get('[data-cy=addIndividualPerson]').should('contain.text', 'Control of Majority of Directors')
    cy.get('[data-cy=addIndividualPerson]').should('contain.text', 'Birthdate')
    cy.get('[data-cy=addIndividualPerson]').should('contain.text', 'Last Known Address')
    cy.get('[data-cy=addIndividualPerson]').should('contain.text', 'Canada Revenue Agency (CRA) Tax Number')
    cy.get('[data-cy=addIndividualPerson]').should('contain.text', 'Tax Residency')
    cy.get('[data-cy=addIndividualPerson]').should('contain.text', 'Unable to Obtain or Confirm Information')
  })

  it('has expected cancel button functionality with add individual', () => {
    cy.get('[data-cy=add-new-btn]').trigger('click')
    cy.get('[data-cy=addIndividualPerson]').should('exist')
    cy.get('[data-cy=add-new-btn]').should('have.attr', 'disabled')

    cy.get('[data-cy=new-si-cancel-btn]').trigger('click')
    cy.get('[data-cy=addIndividualPerson]').should('not.exist')
    cy.get('[data-cy=add-new-btn]').should('not.have.attr', 'disabled')
  })

  it('goes to review confirm page when review confirm is clicked', () => {
    cy.get('[data-cy=button-control-right-button]').eq(0).should('have.text', 'Review and Confirm')
    cy.get('[data-cy=button-control-right-button]').eq(0).click()
    cy.url().should('include', '/review-confirm')
  })

  it('on update Significant Individual Filing Effective Date ' +
    'verifies that only newly added items have their date changed ', () => {
    // select the date of today
    cy.get('[data-cy=date-select]')
      .click()
      .then(() => {
        cy.get('.bcros-date-picker__calendar__day.dp__today').parent().click()
      })

    const today = new Date()
    const expectedDate = dateToString(today, 'YYYY-MM-DD')
    // ensure no dates in summary table have todays date
    cy.get('td:contains("' + expectedDate + '")').should('have.length', 0)

    cy.fixture('individuals').then((testData) => {
      // click 'Add an Individual' button and expand the form
      cy.get('[data-cy=add-new-btn]').click()
      // cy.get('[data-cy=showAddIndividualPersonManually]').click()

      cy.fillOutForm(testData.profile1)

      // click 'Done' button to add the individual
      cy.get('[data-cy=new-si-done-btn]').click()
    })
    // verify only new entry has date set for today. All other elements should have different dates.
    cy.get('[data-cy="summary-table-dates"]:contains("' + expectedDate + '")').should('have.length', 1)
  })
})

describe('pages -> Beneficial Owner Change - no preloaded data in tables', () => {
  beforeEach(() => {
    cy.interceptPostsEntityApiEmpty().as('existingSIs')
    cy.interceptPayFeeApi().as('payFeeApi')
    cy.interceptBusinessContact().as('businessContact')
    cy.interceptBusinessSlim().as('businessApiCall')
    cy.visit('/')
    cy.wait(['@existingSIs', '@businessApiCall', '@payFeeApi', '@businessContact'])
  })

  it('verify summary table is rendered as expected', () => {
    const summaryTableHeaders = cy.get('[data-cy="individualsSummaryTable"]').get('th')
    summaryTableHeaders
      .should('contain', 'Name')
      .and('contain', 'Address')
      .and('contain', 'Details')
      .and('contain', 'Significance Dates')
      .and('contain', 'Control')
    // body should contain correct empty text
    cy.get('[data-cy="individualsSummaryTable"]').get('td')
      .should('contain.text', 'No significant individuals added yet')
  })
})
