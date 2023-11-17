describe('Layout (default) -> Breadcrumb', () => {
  const identifier = 'BC0871427'

  it('shows expected breadcrumb information for owner change page (NO business mock)', () => {
    cy.visit('/')
    cy.get('#bcros-breadcrumb').should('exist')
    // shows the expected breadcrumbs for owner change
    cy.get('[data-cy="crumb-link"]').should('have.length', 4)
    cy.get('[data-cy="crumb-link"]').eq(0).should('contain.text', 'BC Registries Dashboard')
    cy.get('[data-cy="crumb-link"]').eq(1).should('contain.text', 'My Business Registry')
    // this will fail to get the name because unauthorized and trying to access dev so should default to identifier
    cy.get('[data-cy="crumb-link"]').eq(2).should('contain.text', identifier)
    cy.get('[data-cy="crumb-link"]').eq(3).should('contain.text', 'Beneficial Owner Change')
  })

  it('shows expected breadcrumb information for owner change page (business mock)', () => {
    // setup intercept
    cy.intercept(
      'GET',
      `https://legal-api-dev.apps.silver.devops.gov.bc.ca/api/v2/businesses/${identifier}?slim=true`,
      { fixture: 'business.json' })
    // execute test
    cy.visit('/')
    // sanity check (previous test already confirmed)
    cy.get('[data-cy="crumb-link"]').should('have.length', 4)
    // breadcrumb should now reflect the business name from the mock response
    cy.get('[data-cy="crumb-link"]').eq(2).should('contain.text', '0871427 B.C. LTD.')
  })
})

describe('Layout (person) -> Breadcrumb', () => {
  it('shows expected breadcrumb information for profile page', () => {
    cy.visit('/my-registries-details')
    cy.get('#bcros-breadcrumb').should('exist')
    // shows the expected breadcrumbs for owner change
    cy.get('[data-cy="crumb-link"]').should('have.length', 1)
    cy.get('[data-cy="crumb-link"]').eq(0).should('contain.text', 'My BC Registries Details')
  })
})
