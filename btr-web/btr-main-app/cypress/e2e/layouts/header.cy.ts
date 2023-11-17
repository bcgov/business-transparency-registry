describe('Layout -> Header', () => {
  it('shows header in default layout', () => {
    cy.visit('/')
    cy.get('#bcros-main-header').should('exist')
  })

  it('shows header in person layout', () => {
    cy.visit('/my-registries-details')
    cy.get('#bcros-main-header').should('exist')
  })
})
