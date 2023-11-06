describe('Layout -> Footer', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('shows the footer', () => {
    cy.get('#bcros-main-footer')
  })
})
