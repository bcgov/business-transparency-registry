import 'cypress-axe'

Cypress.Commands.add('interceptPostsEntityApi', () => {
  cy.fixture('plotsEntityExistingSiResponse').then((plotsEntityExistingSiResponse) => {
    cy.intercept(
      'GET',
      '/plots/entity/BC0871427',
      plotsEntityExistingSiResponse)
  })
})

Cypress.Commands.add('interceptPostsEntityApiNoSis', () => {
  cy.fixture('plotsEntityExistingSiResponseNoSis').then((plotsEntityExistingSiResponseNoSis) => {
    cy.intercept(
      'GET',
      '/plots/entity/BC0871427',
      plotsEntityExistingSiResponseNoSis)
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
  cy.fixture('payFeeForBtrRegsigin').then(() => {
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

Cypress.Commands.add('visitHomePageNoFakeData', () => {
  cy.interceptPostsEntityApiNoSis().as('existingSIs')
  cy.interceptPayFeeApi().as('payFeeApi')
  cy.interceptBusinessContact().as('businessContact')
  cy.interceptBusinessSlim().as('businessApiCall')
  cy.visit('/')
  cy.wait(['@existingSIs', '@businessApiCall', '@payFeeApi', '@businessContact'])
})

Cypress.Commands.add('visitHomePageWithFakeData', () => {
  cy.interceptPostsEntityApi().as('existingSIs')
  cy.interceptPayFeeApi().as('payFeeApi')
  cy.interceptBusinessContact().as('businessContact')
  cy.interceptBusinessSlim().as('businessApiCall')
  cy.visit('/')
  cy.wait(['@existingSIs', '@businessApiCall', '@payFeeApi', '@businessContact'])
})

Cypress.Commands.add('visitHomePageWithFakeDataAndAxeInject', () => {
  cy.visitHomePageWithFakeData()
  cy.injectAxe()
})

Cypress.Commands.add('addTestIndividuals', () => {
  cy.get('[data-cy=date-select]').click().then(() => {
    cy.get('.bcros-date-picker__calendar__day.dp__today').parent().click()
  })

  cy.fixture('individuals').then((testData) => {
    // Add the first individual
    cy.get('[data-cy=add-new-btn]').click()
    cy.get('#individual-person-full-name').type(testData.profile1.fullName)
    cy.get('[data-cy=usePreferredName').check()
    cy.get('#individual-person-preferred-name').type(testData.profile1.preferredName)
    cy.get('#individual-person-email').type(testData.profile1.email)
    cy.get('[data-cy=testPercentOfShares]').click()
    cy.get('[data-cy=testPercentOfShares]').find('li').first().click()
    cy.get('[data-cy=testPercentOfVotes]').click()
    cy.get('[data-cy=testPercentOfVotes]').find('li').first().click()
    cy.get('[data-cy="testTypeOfControl"]').get('[name="registeredOwner"]').check()
    cy.get('[data-cy="testControlOfDirectors"]').get('[name="directControl"]').check()
    cy.get('#addNewPersonBirthdate').trigger('click')
    cy.get('[data-cy=date-picker]').get('.bcros-date-picker__calendar__day.dp__today').trigger('click')
    cy.get('[data-cy="address-country"]').click()
    cy.get('[data-cy="address-country"]').get('li').contains(testData.profile1.address.country).click()
    cy.get('[data-cy="address-line1-autocomplete"]').type(testData.profile1.address.streetAddress)
    cy.get('[data-cy="address-city"]').type(testData.profile1.address.city)
    cy.get('[data-cy="address-region-select"]').click()
    cy.get('[data-cy="address-region-select"]').get('li').contains(testData.profile1.address.province[0]).click()
    cy.get('[data-cy="address-postal-code"]').type(testData.profile1.address.postalCode)
    cy.get('[data-cy="countryOfCitizenshipRadioGroup"]').get('[type="radio"][value="citizen"]').check()
    cy.get('[data-cy="tax-number-input"]').type(testData.profile1.taxNumber)
    cy.get('[data-cy="testTaxResidency"]').get('[type="radio"][value="true"]').check()
    cy.get('[data-cy=new-si-done-btn]').click()

    // Add the second individual
    cy.get('[data-cy=add-new-btn]').click()
    cy.get('#individual-person-full-name').type(testData.profile2.fullName)
    cy.get('[data-cy=usePreferredName').check()
    cy.get('#individual-person-preferred-name').type(testData.profile2.preferredName)
    cy.get('#individual-person-email').type(testData.profile2.email)
    cy.get('[data-cy=testPercentOfShares]').click()
    cy.get('[data-cy=testPercentOfShares]').find('li').eq(2).click()
    cy.get('[data-cy=testPercentOfVotes]').click()
    cy.get('[data-cy=testPercentOfVotes]').find('li').eq(3).click()
    cy.get('[data-cy="testTypeOfControl"]').get('[name="registeredOwner"]').check()
    cy.get('[data-cy="testControlOfDirectors"]').get('[name="directControl"]').check()
    cy.get('#addNewPersonBirthdate').trigger('click')
    cy.get('[data-cy=date-picker]').get('.bcros-date-picker__calendar__day.dp__today').trigger('click')
    cy.get('[data-cy="address-country"]').click()
    cy.get('[data-cy="address-country"]').get('li').contains(testData.profile2.address.country).click()
    cy.get('[data-cy="address-line1-autocomplete"]').type(testData.profile2.address.streetAddress)
    cy.get('[data-cy="address-city"]').type(testData.profile2.address.city)
    cy.get('[data-cy="address-region-select"]').click()
    cy.get('[data-cy="address-region-select"]').get('li').contains(testData.profile2.address.province[0]).click()
    cy.get('[data-cy="address-postal-code"]').type(testData.profile2.address.postalCode)
    cy.get('[data-cy="countryOfCitizenshipRadioGroup"]').get('[type="radio"][value="citizen"]').check()
    cy.get('[data-cy="tax-number-input"]').type(testData.profile2.taxNumber)
    cy.get('[data-cy="testTaxResidency"]').get('[type="radio"][value="true"]').check()
    cy.get('[data-cy=new-si-done-btn]').click()
  })
})
