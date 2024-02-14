import accounts from '../../fixtures/accounts.json'
import business from '../../fixtures/business.json'
import contact from '../../fixtures/businessContact.json'
import payFeesForBtrRegsigin from '../../fixtures/payFeeForBtrRegsigin.json'

describe('accessibility -> Business Layout', () => {
  beforeEach(() => {
    // setup intercepts
    cy.intercept(
      'GET',
      'https://auth-api-dev.apps.silver.devops.gov.bc.ca/api/v1/users/testSub/settings',
      accounts)
    cy.intercept(
      'GET',
      `https://legal-api-dev.apps.silver.devops.gov.bc.ca/api/v2/businesses/${business.identifier}?slim=true`,
      { business })
    cy.intercept(
      'GET',
      `https://auth-api-dev.apps.silver.devops.gov.bc.ca/api/v1/entities/${business.identifier}`,
      contact)
    cy.intercept(
      'GET',
      'https://pay-api-dev.apps.silver.devops.gov.bc.ca/api/v1/fees/BTR/REGSIGIN',
      payFeesForBtrRegsigin)
  })

  it('checks business layout passes accessibility (logged out)', () => {
    sessionStorage.setItem('FAKE_LOGIN', '')
    cy.visit(`/${business.identifier}/beneficial-owner-change`)
    cy.wait(3000)
    cy.injectAxe()
    // header only (logged out) 19450
    cy.checkA11y({ exclude: ['[data-cy=owner-change]'], include: ['[data-cy=header]'] })
    cy.get('[data-cy=logged-out-menu]').click()
    cy.wait(100)
    cy.checkA11y({ exclude: ['[data-cy=owner-change]'], include: ['[data-cy=header]'] })

    // breadcrumb only 19579
    // cy.checkA11y({ exclude: ['[data-cy=owner-change]'], include: ['[data-cy=breadcrumb]'] })

    // business details only
    cy.checkA11y({ exclude: ['[data-cy=owner-change]'], include: ['[data-cy=business-details]'] })

    // fee summary only 19577
    // the color-contrast check is disabled until the gray color AA issue is resolved in ticket #19782
    // pre-form touched
    cy.checkA11y({ exclude: ['[data-cy=owner-change]'], include: ['[data-cy=pay-fees-widget]'] }, {
      rules: { 'color-contrast': { enabled: false } }
    })
    // post-form touched
    cy.get('[data-cy=date-select]').click()
    cy.wait(250)
    cy.get('.bcros-date-picker__calendar__day.dp__today').parent().click()
    cy.checkA11y({ exclude: ['[data-cy=owner-change]'], include: ['[data-cy=pay-fees-widget]'] }, {
      rules: { 'color-contrast': { enabled: false } }
    })

    // filing control buttons only
    cy.checkA11y({ exclude: ['[data-cy=owner-change]'], include: ['[data-cy=button-control]'] })
    cy.get('[data-cy=button-control-right-button]').click()
    cy.wait(1000)
    cy.checkA11y({ exclude: ['[data-cy=owner-change]'], include: ['[data-cy=button-control]'] })

    // footer only 19455
    cy.checkA11y({ exclude: ['[data-cy=owner-change]'], include: ['[data-cy=footer]'] })

    // full layout (uncomment once all of the above are passing)
    // cy.checkA11y({ exclude: ['[data-cy=owner-change]'], include: ['[data-cy=business-layout]'] })
  })

  it('checks business layout passes accessibility (logged in)', () => {
    sessionStorage.setItem('FAKE_LOGIN', 'true')
    cy.visit(`/${business.identifier}/beneficial-owner-change`)
    cy.wait(3000)
    cy.injectAxe()

    // header only (logged in) 17802
    cy.checkA11y({ exclude: ['[data-cy=owner-change]'], include: ['[data-cy=header]'] })
    cy.get('[data-cy=logged-in-menu]').click()
    cy.wait(100)
    cy.checkA11y({ exclude: ['[data-cy=owner-change]'], include: ['[data-cy=header]'] })

    // full layout (uncomment once all of the above are passing)
    // cy.checkA11y({ exclude: ['[data-cy=owner-change]'], include: ['[data-cy=business-layout]'] })
  })
})
