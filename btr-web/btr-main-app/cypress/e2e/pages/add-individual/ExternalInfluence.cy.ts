describe('pages -> Add individual', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('renders the External Influence section and default radio is selected', () => {
    cy.get('[data-cy=add-new-btn]').trigger('click')
    // cy.get('[data-cy="showAddIndividualPersonManually"]').trigger('click')

  }

})
