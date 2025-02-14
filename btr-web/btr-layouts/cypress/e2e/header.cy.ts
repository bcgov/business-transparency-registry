describe('Layout -> Header (logged out)', () => {
  // selectors
  const header = '#bcros-main-header'
  const headerContainer = header + '__container'
  const headerContainerActions = headerContainer + '__actions'
  const homeRedirect = headerContainerActions + '__home-redirect'
  const headerMenus = headerContainerActions + '__menus'

  beforeEach(() => {
    cy.intercept('GET', 'https://**.launchdarkly.com/**', {}).as('DARKLY')
    cy.intercept('POST', 'https://**.launchdarkly.com/**', {}).as('DARKLY_POST')
    cy.intercept('GET', 'https://dev.loginproxy.gov.bc.ca/**').as('LOGIN_PROXY')
    cy.visit('/')
    // give time for the keycloak init / page hydration
    cy.wait(['@LOGIN_PROXY'])
  })

  it('renders header in logged out state', () => {
    cy.get(header)
    cy.get(headerContainer)
    cy.get(headerContainerActions)
    // home link
    cy.get(homeRedirect).contains('BC Registry and Online Services')
    cy.get(headerMenus)
    // login options
    cy.get('[data-cy=logged-out-menu]')
    cy.get('[data-cy=logged-out-menu]').contains('Log in')
    // create account btn
    cy.get('[data-cy=logged-out-create-accnt]')
    cy.get('[data-cy=logged-out-create-accnt]').contains('Create account')
    // Logged in menu should NOT be there
    cy.get('[data-cy=logged-in-menu]').should('not.exist')
  })

  it('opens login options when clicked', () => {
    cy.get('[data-cy=menu-item]').should('not.exist')
    cy.get('[data-cy=logged-out-menu]').click()
    cy.get('[data-cy="menu-item"]').should('have.length', 3)
    cy.get('[data-cy="menu-item"]').eq(0).contains('BC Services Card')
    cy.get('[data-cy="menu-item"]').eq(1).contains('BCeID')
    cy.get('[data-cy="menu-item"]').eq(2).contains('IDIR')
  })

  it('redirects to services card login when clicked', () => {
    cy.intercept('GET', 'https://**.bcregistry.gov.bc.ca/signin/bcsc', {}).as('LOGIN_BCSC')
    Cypress.config('defaultCommandTimeout', 30000)
    cy.get('[data-cy=logged-out-menu]').click()
    cy.get('[data-cy="menu-item"]').eq(0).click()
    cy.wait(['@LOGIN_BCSC']) // if it does not expire it means clicking button calls expected link
  })

  it('redirects to bceid login when clicked', () => {
    cy.intercept('GET', 'https://**.bcregistry.gov.bc.ca/signin/bceid', {}).as('LOGIN_BCEID')
    Cypress.config('defaultCommandTimeout', 30000)
    cy.get('[data-cy=logged-out-menu]').click()
    cy.get('[data-cy="menu-item"]').eq(1).click()
    cy.wait(['@LOGIN_BCEID']) // if it does not expire it means clicking button calls expected link
  })

  it('redirects to idir login when clicked', () => {
    cy.intercept('GET', 'https://**.bcregistry.gov.bc.ca/signin/idir', {}).as('LOGIN_IDIR')
    Cypress.config('defaultCommandTimeout', 30000)
    cy.get('[data-cy=logged-out-menu]').click()
    cy.get('[data-cy="menu-item"]').eq(2).click()
    cy.wait(['@LOGIN_IDIR']) // if it does not expire it means clicking button calls expected link
  })

  it('redirects to create account when clicked', () => {
    cy.intercept('GET', 'https://**.account.bcregistry.gov.bc.ca/choose-authentication-method ', {})
      .as('CREATE_ACCOUNT')
    Cypress.config('defaultCommandTimeout', 30000)
    cy.get('[data-cy=logged-out-create-accnt]').click()
    cy.wait(['@CREATE_ACCOUNT']) // if it does not expire it means clicking button calls expected link
  })
})
