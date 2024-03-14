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
    Cypress.config('defaultCommandTimeout', 30000)
    cy.get('[data-cy=logged-out-menu]').click()
    cy.get('[data-cy="menu-item"]').eq(0).click()
    cy.wait(['@DARKLY', '@LOGIN_PROXY'])
    cy.origin('https://idtest.gov.bc.ca', () => {
      cy.url().should('include', 'login/entry#start')
    })
  })

  it('redirects to bceid login when clicked', () => {
    Cypress.config('defaultCommandTimeout', 30000)
    cy.get('[data-cy=logged-out-menu]').click()
    cy.get('[data-cy="menu-item"]').eq(1).click()
    cy.wait(['@DARKLY', '@LOGIN_PROXY'])
    cy.origin('https://logontest7.gov.bc.ca', () => {
      cy.url().should('include', 'clp-cgi/capBceid/logon.cgi')
    })
  })

  it('redirects to idir login when clicked', () => {
    Cypress.config('defaultCommandTimeout', 30000)
    cy.get('[data-cy=logged-out-menu]').click()
    cy.get('[data-cy="menu-item"]').eq(2).click()
    cy.wait(['@DARKLY', '@LOGIN_PROXY'])
    cy.origin('https://logontest7.gov.bc.ca', () => {
      cy.url().should('include', 'clp-cgi/int/logon.cgi')
    })
  })

  it('redirects to create account when clicked', () => {
    Cypress.config('defaultCommandTimeout', 30000)
    cy.get('[data-cy=logged-out-create-accnt]').click()
    cy.wait(['@DARKLY', '@LOGIN_PROXY'])
    cy.origin('https://dev.account.bcregistry.gov.bc.ca', () => {
      cy.url().should('include', 'choose-authentication-method')
    })
  })
})
