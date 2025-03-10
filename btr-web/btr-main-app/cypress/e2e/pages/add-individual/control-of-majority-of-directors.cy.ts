describe('pages -> Add individual', () => {
  beforeEach(() => {
    cy.visitHomePageNoFakeData()
  })

  it('verify the control of director component is working', () => {
    cy.get('[data-cy=add-new-btn]').trigger('click')
    // cy.get('[data-cy="showAddIndividualPersonManually"]').trigger('click')

    cy.get('[data-cy="testControlOfDirectors"]').should('exist')

    cy.get('[data-cy="controlOfDirectors.directControl"]').check().should('be.checked')
    cy.get('[data-cy="controlOfDirectors.indirectControl"]').check().should('be.checked')
    cy.get('[data-cy="controlOfDirectors.significantInfluence"]').check().should('be.checked')
    cy.get('[data-cy="controlOfDirectors.jointlyOrInConcert.hasJointlyOrInConcert"]').check().should('be.checked')
  })

  it('ensure the error message is displayed when inConcert or joint control is selected ', () => {
    cy.get('[data-cy=add-new-btn]').trigger('click')

    const message = 'Please indicate at least one type of control'
    cy.get('[data-cy="controlOfDirectors.jointlyOrInConcert.hasJointlyOrInConcert"]').check()
    cy.get('[data-cy="controlOfDirectors.jointlyOrInConcert.actingJointly"]').check()
    cy.get('[data-cy="testControlOfDirectors"]').should('contain.text', message)
    cy.get('[data-cy="controlOfDirectors.directControl"]').check()
    cy.get('[data-cy="testControlOfDirectors"]').should('not.contain.text', message)
  })
})
