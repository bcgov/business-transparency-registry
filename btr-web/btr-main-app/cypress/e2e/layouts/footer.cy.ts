describe('Layout -> Footer', () => {
  it('shows the footer in business layout', () => {
    cy.visit('/')
    cy.get('#bcros-main-footer').should('exist')
  })

  it('shows the footer in person layout', () => {
    cy.visit('/my-registries-details')
    cy.get('#bcros-main-footer').should('exist')
  })
})
