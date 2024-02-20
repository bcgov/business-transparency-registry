import 'cypress-axe'
import business from '~/cypress/fixtures/business.json'

Cypress.Commands.add('interceptPostsEntityApi', () => {
  cy.fixture('plotsEntityExistingSiResponse').then((plotsEntityExistingSiResponse) => {
    cy.intercept(
      'GET',
      '/plots/entity/BC0871427',
      plotsEntityExistingSiResponse)
  })
})

Cypress.Commands.add('interceptPostsEntityApiEmpty', () => {
  cy.intercept(
    'GET',
    '/plots/entity/BC0871427',
    {})
})

Cypress.Commands.add('interceptPayFeeApi', () => {
  cy.fixture('payFeeForBtrRegsigin').then((payFeesForBtrRegsigin) => {
    cy.intercept(
      'GET',
      'https://pay-api-dev.apps.silver.devops.gov.bc.ca/api/v1/fees/BTR/REGSIGIN',
      { data: payFeesForBtrRegsigin })
  })
})

Cypress.Commands.add('interceptLearApiEmptyResponse', () => {
  cy.fixture('payFeeForBtrRegsigin').then((payFeesForBtrRegsigin) => {
    cy.intercept(
      'GET',
      'https://pay-api-dev.apps.silver.devops.gov.bc.ca/api/v1/fees/BTR/REGSIGIN',
      {})
  })
})

Cypress.Commands.add('interceptAccounts', () => {
  cy.fixture('accounts').then((accounts) => {
    cy.intercept(
      'GET',
      'https://auth-api-dev.apps.silver.devops.gov.bc.ca/api/v1/users/testSub/settings',
      accounts)
  })
})

Cypress.Commands.add('interceptBusinessSlim', () => {
  cy.fixture('business').then((business) => {
    cy.intercept(
      'GET',
      `https://legal-api-dev.apps.silver.devops.gov.bc.ca/api/v2/businesses/${business.identifier}?slim=true`,
      { business })
  })
})

Cypress.Commands.add('interceptBusinessContact', () => {
  cy.fixture('business').then((business) => {
    cy.fixture('businessContact').then((contact) => {
      cy.intercept(
        'GET',
        `https://auth-api-dev.apps.silver.devops.gov.bc.ca/api/v1/entities/${business.identifier}`,
        contact)
    })
  })
})

Cypress.Commands.add('loadAllApiFakeData', () => {
  cy.interceptPostsEntityApi().as('existingSIs')
  cy.interceptPayFeeApi().as('payFeeApi')
  cy.interceptBusinessContact().as('businessContact')
  cy.interceptBusinessSlim().as('businessApiCall')
})

Cypress.Commands.add('visitHomePageWithFakeDataAndAxeInject', () => {
  cy.loadAllApiFakeData()
  cy.visit('/')
  cy.wait(['@existingSIs', '@businessApiCall', '@payFeeApi', '@businessContact'])
  cy.injectAxe()
})
