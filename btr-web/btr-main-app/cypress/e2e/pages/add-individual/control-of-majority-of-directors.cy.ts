describe('pages -> Add individual', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('verify the control of director component is working', () => {
    cy.get('[data-cy=add-new-btn]').trigger('click')
    // cy.get('[data-cy="showAddIndividualPersonManually"]').trigger('click')

    const checkboxes = cy.get('[data-cy="testControlOfDirectors"]').should('exist')

    checkboxes.get('[name="directControl"]').check().should('be.checked')
    checkboxes.get('[name="indirectControl"]').check().should('be.checked')
    checkboxes.get('[name="significantInfluence"]').check().should('be.checked')
    checkboxes.get('[name="inConcertControl"]').check().should('be.checked')
  })

  it('test the tooltip', () => {
    cy.get('[data-cy=add-new-btn]').trigger('click')
    // cy.get('[data-cy="showAddIndividualPersonManually"]').trigger('click')

    const checkboxes = cy.get('[data-cy="testControlOfDirectors"]').should('exist')

    checkboxes.get('[data-cy="control-of-directors-tooltip"]').trigger('mouseover')
    cy.get('[data-cy="control-of-directors-tooltip-content"').should('exist')
    checkboxes.get('[data-cy="control-of-directors-tooltip"]').trigger('mouseleave')
    cy.get('[data-cy="control-of-directors-tooltip-content"').should('not.exist')
  })
})
