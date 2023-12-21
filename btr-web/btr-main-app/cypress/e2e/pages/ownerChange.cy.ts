import moment from 'moment'

describe('pages -> Beneficial Owner Change', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('redirected to owner change page', () => {
    // NOTE: this will change when we design a landing page. Once that happens change the cy.visit('/') ^
    cy.url().should('include', '/BC0871427/beneficial-owner-change')
  })

  it('rendered expected information', () => {
    cy.get('[data-cy=page-header]').should('have.text', 'Significant Individual Change')
    cy.get('[data-cy=page-info-text]').should('contain.text', 'Select the date of your significant')
    cy.get('[data-cy=effective-date-select]').should('have.text', 'Significant Individual Change Date')
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
    cy.get('[data-cy=testPreferredName]').should('exist')
    cy.get('[data-cy=testEmail]').should('exist')
    cy.get('[data-cy=showAddIndividualPersonManually]')
      .should('have.text', ' Add transparency register information manually')
    cy.get('[data-cy=addIndividualPerson]').should('not.contain.text', 'Beneficial Ownership Assessment')
    cy.get('[data-cy=new-si-cancel-btn]').should('have.text', 'Cancel')
    cy.get('[data-cy=new-si-done-btn]').should('have.text', 'Done')
    // should disable add button while add individual is expanded
    cy.get('[data-cy=add-new-btn]').should('have.attr', 'disabled')
  })

  it('expands all parts when manual entry clicked', () => {
    cy.get('[data-cy=add-new-btn]').trigger('click')

    cy.get('[data-cy=showAddIndividualPersonManually]').trigger('click')
    cy.get('[data-cy=showAddIndividualPersonManually]')
      .should('have.text', ' Cancel transparent register information')

    cy.get('[data-cy=addIndividualPerson]').should('contain.text', 'Beneficial Ownership Assessment')
    cy.get('[data-cy=addIndividualPerson]').should('contain.text', 'Control of Shares and Votes')
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

  it('has expected done button functionality with add individual', () => {
    cy.get('[data-cy=add-new-btn]').trigger('click')
    cy.get('[data-cy=addIndividualPerson]').should('exist')
    cy.get('[data-cy=add-new-btn]').should('have.attr', 'disabled')

    // FUTURE: fill out full form so it passes validation
    const testName = 'Mr Tester'
    cy.get('[data-cy=testFullName]').get('#individual-person-full-name').type(testName)
    cy.get('[data-cy=new-si-done-btn]').trigger('click')
    cy.get('[data-cy=addIndividualPerson]').should('not.exist')
    cy.get('[data-cy=add-new-btn]').should('not.have.attr', 'disabled')
    cy.get('[data-cy=individualsSummaryTable]').get('td').eq(0).should('have.text', testName.toUpperCase())
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

  it('goes to review confirm page when review confirm is clicked', () => {
    cy.get('[data-cy=button-control-right-button]').eq(0).should('have.text', 'Review and Confirm')
    cy.get('[data-cy=button-control-right-button]').eq(0).click()
    cy.url().should('include', '/review-confirm')
  })
})
