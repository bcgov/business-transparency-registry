describe('pages -> Beneficial Owner Change', () => {
  beforeEach(() => {})

  it('Verify actions related to "no-significant-individuals-exist" section', () => {
    cy.visitHomePageWithFakeData()

    cy.get('[data-cy="noSignificantIndividualsExist-checkbox"]').should('not.exist')
    cy.get('[data-cy="significantIndividuals-section"]').should('exist')
  })

  it('Verify actions related to "no-significant-individuals-exist" section when there is no existing SIs', () => {
    cy.visitHomePageNoFakeData()

    cy.get('[data-cy="noSignificantIndividualsExist-checkbox"]').should('exist')
    cy.get('[data-cy="significantIndividuals-section"]').should('exist')
    cy.get('[data-cy="noSignificantIndividualsExist-checkbox"]').check()
    cy.get('[data-cy="significantIndividuals-section"]').should('not.exist')
  })
})
