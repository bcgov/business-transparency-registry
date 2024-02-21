describe('Layout -> Breadcrumb', () => {
  beforeEach(() => {
    cy.visit('/')
    // cypress does not wait for hydration so need to wait manually (effects button clicks in some cases)
    cy.wait(100)
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

  it('redirects to breadcrumb link', () => {
    cy.get('[data-cy="crumb-link"]').eq(0).click()
    cy.origin('https://dev.bcregistry.gov.bc.ca', () => {
      cy.url().should('include', '/login')
    })
  })

  it('triggers expected back button functionality', () => {
    cy.get('[data-cy="crumb-back"]').click()
    // should've gone to previous breadcrumb in the list
    cy.origin('https://dev.account.bcregistry.gov.bc.ca', () => {
      cy.url().should('include', '/decide-business')
    })
  })
})
