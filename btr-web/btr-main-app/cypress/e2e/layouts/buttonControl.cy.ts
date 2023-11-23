describe('Layout -> ButtonControl', () => {
  it('shows button control in the business layout for SI change', () => {
    cy.visit('/')
    cy.wait(1000)
    cy.get('#bcros-button-control').should('exist')
    cy.get('[data-cy=button-control-left-button]').should('have.length', 3)
    cy.get('[data-cy=button-control-left-button]').eq(0).should('have.text', 'Cancel')
    cy.get('[data-cy=button-control-left-button]').eq(1).should('have.text', 'Save and Resume Later')
    cy.get('[data-cy=button-control-left-button]').eq(2).should('have.text', 'Save')
    cy.get('[data-cy=button-control-right-button]').should('have.length', 1)
    cy.get('[data-cy=button-control-right-button]').eq(0).should('have.text', 'Review and Confirm')
  })

  it('does NOT show button control in the person layout for profile', () => {
    cy.visit('/my-registries-details')
    cy.get('#bcros-button-control').should('not.exist')
  })
})
