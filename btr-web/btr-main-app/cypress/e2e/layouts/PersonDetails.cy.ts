describe('Layout -> Person Details', () => {
  it('does NOT show in business layout', () => {
    cy.visit('/')
    cy.get('#bcros-person-details').should('not.exist')
  })

  it('shows in person layout', () => {
    cy.visit('/my-registries-details')
    cy.get('#bcros-person-details').should('exist')
  })
})
