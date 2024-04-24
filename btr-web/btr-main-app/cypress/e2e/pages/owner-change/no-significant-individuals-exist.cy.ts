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
    cy.get('[data-cy="add-new-btn"]').should('not.be.disabled')
    cy.get('[data-cy="import-legacy-si-list-btn"]').should('exist')
    cy.get('[data-cy="noSignificantIndividualsExistExplain"]').should('not.exist')

    cy.get('[data-cy="noSignificantIndividualsExist-checkbox"]').check()

    cy.get('[data-cy="noSignificantIndividualsExistExplain"]').should('exist')
    cy.get('[data-cy="import-legacy-si-list-btn"]').should('not.exist')
    cy.get('[data-cy="add-new-btn"]').should('be.disabled')
  })

  it('Verify actions related to "no-significant-individuals-exist" section when there is no existing SIs', () => {
    cy.visitHomePageNoFakeData()

    cy.get('[data-cy="noSignificantIndividualsExist-checkbox"]').should('exist')
    cy.get('[data-cy="significantIndividuals-section"]').should('exist')
    cy.get('[data-cy="add-new-btn"]').should('not.be.disabled')
    cy.get('[data-cy="import-legacy-si-list-btn"]').should('exist')
    cy.get('[data-cy="noSignificantIndividualsExistExplain"]').should('not.exist')

    cy.get('[data-cy="add-new-btn"]').click()

    cy.get('[data-cy="noSignificantIndividualsExist-checkbox"]').should('not.exist')
  })
})
