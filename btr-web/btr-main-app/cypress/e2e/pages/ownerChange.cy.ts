describe('pages -> Beneficial Owner Change', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('redirected to owner change page', () => {
    // NOTE: this will change when we design a landing page. Once that happens change the cy.visit('/') ^
    cy.url().should('include', '/BC0871427/beneficial-owner-change')
  })
  it('verify all parts visible when manual entry clicked', () => {
    cy.contains('Add transparency register information manually')

    cy.get('[data-cy="showAddIndividualPersonManually"]').trigger('click')

    cy.contains('Cancel transparent register information')
    cy.contains('Beneficial Ownership Assessment')
    cy.contains('Control of Shares and Votes')
    cy.contains('Birthdate')
  })

  it('verify summary table is rendered', () => {
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
