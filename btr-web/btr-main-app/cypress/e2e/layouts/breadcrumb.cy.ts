describe('Layout -> Breadcrumb', () => {
  const identifier = 'BC0871427'

  it('shows expected header information for owner change page (NO business mock)', () => {
    cy.visit(`/${identifier}/beneficial-owner-change`)
    cy.get('#bcros-breadcrumb')
    // shows the expected breadcrumbs for owner change
    cy.get('[data-cy="crumb-link"]').should('have.length', 4)
    cy.get('[data-cy="crumb-link"]').eq(0).contains('BC Registries Dashboard')
    cy.get('[data-cy="crumb-link"]').eq(1).contains('My Business Registry')
    // this will fail to get the name because unauthorized and trying to access dev so should default to identifier
    cy.get('[data-cy="crumb-link"]').eq(2).contains(identifier)
    cy.get('[data-cy="crumb-link"]').eq(3).contains('Beneficial Owner Change')
  })

  it('shows expected header information for owner change page (business mock)', () => {
    // setup intercept
    cy.intercept(
      'GET',
      `https://legal-api-dev.apps.silver.devops.gov.bc.ca/api/v2/businesses/${identifier}?slim=true`,
      { fixture: 'business.json' })
    // execute test
    cy.visit(`/${identifier}/beneficial-owner-change`)
    // sanity check (previous test already confirmed)
    cy.get('[data-cy="crumb-link"]').should('have.length', 4)
    // breadcrumb should now reflect the business name from the mock response
    cy.get('[data-cy="crumb-link"]').eq(2).contains('0871427 B.C. LTD.')
  })
})
