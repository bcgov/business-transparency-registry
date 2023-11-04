describe('Layout -> Header', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('shows header', () => {
    cy.get('#bcros-main-header')
  })
})
