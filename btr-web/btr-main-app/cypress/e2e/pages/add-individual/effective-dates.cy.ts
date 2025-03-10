describe('pages -> Add individual -> effective dates', () => {
  beforeEach(() => {
    cy.visitHomePageNoFakeData()
    cy.get('[data-cy=add-new-btn]').trigger('click')
  })

  it('verify the effective dates section is being rendered with appropriate empty elements', () => {
    // first on empty individual
    cy.get('[data-cy="effective-date-section"]').should('exist')
    cy.get('*[data-cy^="effective-date-group-"]').should('exist')
    cy.get('[data-cy="start-date-select"]').should('exist')
    cy.get('[data-cy="end-date-select"]').should('not.exist')
    cy.get('[data-cy="show-end-date-button"]').should('exist')
    cy.get('[data-cy="add-new-group-button"]').should('not.exist')

    // click show end date
    // - hide show end date button
    // - display end date box
    // - display add new group button
    cy.get('[data-cy="show-end-date-button"]').trigger('click')
    cy.get('[data-cy="end-date-select"]').should('exist')
    cy.get('[data-cy="show-end-date-button"]').should('not.exist')
    cy.get('[data-cy="add-new-group-button"]').should('exist')

    // add new date group
    // - display new row with only start date
    cy.get('[data-cy="add-new-group-button"]').trigger('click')
    cy.get('[data-cy="end-date-select"]').should('have.length', 1)
    cy.get('[data-cy="start-date-select"]').should('have.length', 2)
    cy.get('[data-cy="show-end-date-button"]').should('exist')
    cy.get('[data-cy="add-new-group-button"]').should('not.exist')
    cy.get('*[data-cy^="effective-date-group-"]').should('have.length', 2)
  })
})
