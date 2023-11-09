describe('Layout -> Breadcrumb', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('renders breadcrumbs', () => {
    // default page should have test breadcrumb values in its meta
    cy.get('#bcros-breadcrumb')
    cy.get('[data-cy="crumb-back"]')
    cy.get('[data-cy="crumb-link"]').should('have.length', 3)
    cy.get('[data-cy="crumb-link"]').eq(0).contains('crumb 1')
    cy.get('[data-cy="crumb-link"]').eq(1).contains('crumb 2')
    cy.get('[data-cy="crumb-link"]').eq(2).contains('crumb 3')
  })
})
