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
    cy.get('[data-cy=date-picker]').get('.bcros-date-picker__calendar__day.dp__today').trigger('click')
    const today = moment(new Date()).format('MM/D/YYYY')
    cy.get('[data-cy=date-select]').should('have.value', today)
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
    // should hide add button while add individual is expanded
    cy.get('[data-cy=add-new-btn]').should('not.exist')
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
    cy.get('[data-cy=add-new-btn]').should('not.exist')

    cy.get('[data-cy=new-si-cancel-btn]').trigger('click')
    cy.get('[data-cy=addIndividualPerson]').should('not.exist')
    cy.get('[data-cy=add-new-btn]').should('exist')
  })

  it('has expected done button functionality with add individual', () => {
    cy.get('[data-cy=add-new-btn]').trigger('click')
    cy.get('[data-cy=addIndividualPerson]').should('exist')
    cy.get('[data-cy=add-new-btn]').should('not.exist')

    // FUTURE: fill out full form so it passes validation
    const testName = 'Mr Tester'
    cy.get('[data-cy=testFullName]').get('#individual-person-full-name').type(testName)
    cy.get('[data-cy=new-si-done-btn]').trigger('click')
    cy.get('[data-cy=addIndividualPerson]').should('not.exist')
    cy.get('[data-cy=add-new-btn]').should('exist')
    cy.get('[data-cy=individualsSummaryTable]').get('td').eq(0).should('have.text', testName.toUpperCase())
  })

  it('verify summary table is rendered as expected', () => {
    const summaryTableHeaders = cy.get('[data-cy="individualsSummaryTable"]').get('th')
    summaryTableHeaders.children()
      .should('contain', 'Name')
      .and('contain', 'Address')
      .and('contain', 'Details')
      .and('contain', 'Significance Dates')
      .and('contain', 'Controls')
    // body should contain correct empty text
    cy.get('[data-cy="individualsSummaryTable"]').get('td')
      .should('contain.text', 'No significant individuals added yet')
  })
})
