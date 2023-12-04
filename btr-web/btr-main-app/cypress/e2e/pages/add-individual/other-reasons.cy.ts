describe('pages -> Add individual', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('renders the OtherReason component', () => {
    cy.get('[data-cy=add-new-btn]').trigger('click')

    cy.get('[data-cy="showAddIndividualPersonManually"]').trigger('click')

    cy.get('[data-cy="otherReasons"]')

    cy.get('[data-cy="otherReasonsTextArea"]').should('exist')

    cy.get('[data-cy="otherReasonsTextArea"] >> textarea').type('test test').blur()

    cy.get('[data-cy="otherReasonsTextArea"]').contains('9 / 1000 characters')
  })
})
