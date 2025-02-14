describe('Layout -> Breadcrumb', () => {
  beforeEach(() => {
    cy.intercept('GET', 'https://**.launchdarkly.com/**', {}).as('DARKLY')
    cy.intercept('POST', 'https://**.launchdarkly.com/**', {}).as('DARKLY_POST')
    cy.intercept('GET', 'https://dev.loginproxy.gov.bc.ca/**').as('LOGIN_PROXY')
    cy.visit('/')
    // give time for the keycloak init / page hydration
    cy.wait(['@LOGIN_PROXY'])
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
    cy.intercept('GET', 'https://**.bcregistry.gov.bc.ca/**/login', {}).as('REDIRECT_LOGIN')
    cy.get('[data-cy="crumb-link"]').eq(0).click()
    cy.wait(['@REDIRECT_LOGIN']) // if it does not expire it means clicking button calls expected link
  })

  it('triggers expected back button functionality', () => {
    cy.intercept('GET', 'https://**.bcregistry.gov.bc.ca/**/decide-business', {})
      .as('DECIDE_BUSINESS')
    cy.get('[data-cy="crumb-back"]').click()
    // should've gone to previous breadcrumb in the list
    cy.wait(['@DECIDE_BUSINESS']) // if it does not expire it means clicking button calls expected link
  })
})
