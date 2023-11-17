describe('Layout -> Person Details', () => {
  it('does NOT show in default layout', () => {
    cy.visit('/')
    cy.get('#bcros-person-details').should('not.exist')
  })

  it('shows header in person layout', () => {
    cy.visit('/my-registries-details')
    cy.get('#bcros-person-details').should('exist')
  })
})
