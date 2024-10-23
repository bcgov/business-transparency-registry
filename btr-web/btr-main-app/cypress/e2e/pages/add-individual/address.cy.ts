describe('pages -> Add individual', () => {
  beforeEach(() => {
    cy.visitHomePageWithFakeData()
  })

  it('verify mailing address component is hidden at start', () => {
    cy.get('[data-cy=add-new-btn]').trigger('click')
    // cy.get('[data-cy="showAddIndividualPersonManually"]').trigger('click')

    cy.get('[data-cy="address-city"]').should('have.length', 1)
    cy.get('[data-cy="mailingAddressIsDifferent-checkbox"]').check()
    cy.get('[data-cy="address-city"]').should('have.length', 2)
    cy.get('[data-cy="mailingAddressIsDifferent-checkbox"]').uncheck()
    cy.get('[data-cy="address-city"]').should('have.length', 1)
  })
})
