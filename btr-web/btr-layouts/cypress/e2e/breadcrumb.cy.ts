describe('Layout -> Breadcrumb', () => {
  beforeEach(() => {
    cy.intercept('https://app.launchdarkly.com/**').as('DARKLY')
    cy.intercept('POST', 'https://events.launchdarkly.com/**').as('DARKLY_POST')
    cy.intercept('GET', 'https://dev.loginproxy.gov.bc.ca/**').as('LOGIN_PROXY')
    cy.visit('/')
    // give time for the keycloak init / page hydration
    cy.wait(['@LOGIN_PROXY', '@DARKLY', '@DARKLY_POST'], { timeout: 15000 })
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
