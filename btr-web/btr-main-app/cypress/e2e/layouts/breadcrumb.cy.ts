import business from '../../fixtures/business.json'

describe('Layout (business) -> Breadcrumb', () => {
  it('shows expected breadcrumb information for owner change page (NO business mock)', () => {
    cy.visit('/')
    cy.wait(1000)
    cy.get('#bcros-breadcrumb').should('exist')
    // shows the expected breadcrumbs for owner change
    cy.get('[data-cy="crumb-link"]').should('have.length', 4)
    cy.get('[data-cy="crumb-link"]').eq(0).should('contain.text', 'BC Registries Dashboard')
    cy.get('[data-cy="crumb-link"]').eq(1).should('contain.text', 'My Business Registry')
    // this will fail to get the name because unauthorized and trying to access dev so should default to identifier
    cy.get('[data-cy="crumb-link"]').eq(2).should('contain.text', business.identifier)
    cy.get('[data-cy="crumb-link"]').eq(3).should('contain.text', 'Significant Individual Change')
  })

  it('shows expected breadcrumb information for owner change page (business mock)', () => {
    // setup intercept
    cy.intercept(
      'GET',
      `https://legal-api-dev.apps.silver.devops.gov.bc.ca/api/v2/businesses/${business.identifier}?slim=true`,
      { business })
    // execute test
    cy.visit('/')
    cy.wait(1000)
    // sanity check (previous test already confirmed)
    cy.get('[data-cy="crumb-link"]').should('have.length', 4)
    // breadcrumb should now reflect the business name from the mock response
    cy.get('[data-cy="crumb-link"]').eq(2).should('contain.text', business.legalName)
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
