describe('pages -> Add individual', () => {
  beforeEach(() => {
    // navigate to index page and check footer and header exist
    cy.visit('http://localhost:3000')

    cy.get('#bcros-main-header')
    cy.get('#bcros-main-footer')
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
  })
})
