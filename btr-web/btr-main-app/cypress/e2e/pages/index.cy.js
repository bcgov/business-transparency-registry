describe('pages -> Add individual', () => {
  it('verify all parts visible when manual entry selected', () => {
    cy.visit('http://localhost:3000')

    cy.get('#bcros-main-header')
    cy.get('#bcros-main-footer')

    cy.contains('Add transparency register information manually')
  })
})
