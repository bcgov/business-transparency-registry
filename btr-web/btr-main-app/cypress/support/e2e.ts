import 'cypress-axe'
import './ownerChangeFormHelper'
import { SubmissionTypeE } from '../../enums/submission-type-e'

Cypress.Commands.add('interceptPostsBtrApi', () => {
  cy.fixture('plotsEntityExistingSiResponse').then((plotsEntityExistingSiResponse) => {
    cy.intercept(
      'GET',
      '/plots/entity/BC0871427',
      plotsEntityExistingSiResponse)
  })
})

Cypress.Commands.add('interceptPostsBtrApiNoSis', () => {
  cy.fixture('plotsEntityExistingSiResponseNoSis').then((plotsEntityExistingSiResponseNoSis) => {
    cy.intercept(
      'GET',
      '/plots/entity/BC0871427',
      plotsEntityExistingSiResponseNoSis)
  })
})

Cypress.Commands.add('interceptPostsBtrApiNoPreviousSubmissions', () => {
  cy.intercept(
    'GET',
    '/plots/entity/BC0871427',
    { statusCode: 404, headers: { 'x-not-found': 'true' } })
})

Cypress.Commands.add('interceptPostsBtrApiEmpty', () => {
  cy.intercept(
    'GET',
    '/plots/entity/BC0871427',
    {})
})

Cypress.Commands.add('interceptPayFeeApi', () => {
  cy.fixture('payFeeForBtrRegsigin').then((payFeesForBtrRegsigin) => {
    cy.intercept(
      'GET',
      '**/api/v1/fees/BTR/REGSIGIN',
      { data: payFeesForBtrRegsigin })
  })
})

Cypress.Commands.add('interceptLearApiEmptyResponse', () => {
  cy.fixture('payFeeForBtrRegsigin').then(() => {
    cy.intercept(
      'GET',
      '**/api/v1/fees/BTR/REGSIGIN',
      {})
  })
})

Cypress.Commands.add('interceptAccounts', () => {
  cy.fixture('accounts').then((accounts) => {
    cy.intercept(
      'GET',
      '**/api/v1/users/testSub/settings',
      accounts)
  })
})

Cypress.Commands.add('interceptBusinessSlim', () => {
  cy.fixture('business').then((business) => {
    cy.intercept(
      'GET',
      `**/api/v2/businesses/${business.identifier}?slim=true`,
      { business })
  })
})

Cypress.Commands.add('interceptBusinessContact', () => {
  cy.fixture('business').then((business) => {
    cy.fixture('businessContact').then((contact) => {
      cy.intercept(
        'GET',
        `**/api/v1/entities/${business.identifier}`,
        contact)
    })
  })
})

Cypress.Commands.add('visitHomePageNoPreviousSiSubmissions', (businessIdentifier?: string) => {
  if (!businessIdentifier) {
    businessIdentifier = 'BC0871427'
  }
  cy.interceptPostsBtrApiNoPreviousSubmissions().as('noSubmissionsSi')
  cy.interceptPayFeeApi().as('payFeeApi')
  cy.interceptBusinessContact().as('businessContact')
  cy.interceptBusinessSlim().as('businessApiCall')
  cy.visit(`/${businessIdentifier}/beneficial-owner-change?submissionType=${SubmissionTypeE.INITIAL_FILING}`)
  cy.wait(['@noSubmissionsSi', '@businessApiCall', '@payFeeApi', '@businessContact'])
})

Cypress.Commands.add('visitHomePageNoFakeData', (businessIdentifier?: string, submissionType?: SubmissionTypeE) => {
  if (!businessIdentifier) {
    businessIdentifier = 'BC0871427'
  }
  if (!submissionType) {
    submissionType = SubmissionTypeE.INITIAL_FILING
  }
  cy.interceptPostsBtrApiNoSis().as('existingSIs')
  cy.interceptPayFeeApi().as('payFeeApi')
  cy.interceptBusinessContact().as('businessContact')
  cy.interceptBusinessSlim().as('businessApiCall')
  cy.visit(`/${businessIdentifier}/beneficial-owner-change?submissionType=` + submissionType)
  cy.wait(['@existingSIs', '@businessApiCall', '@payFeeApi', '@businessContact'])
})

Cypress.Commands.add('visitHomePageWithFakeData', (businessIdentifier?: string, submissionType?: SubmissionTypeE) => {
  if (!businessIdentifier) {
    businessIdentifier = 'BC0871427'
  }
  if (!submissionType) {
    submissionType = SubmissionTypeE.CHANGE_FILING
  }
  cy.interceptPostsBtrApi().as('existingSIs')
  cy.interceptPayFeeApi().as('payFeeApi')
  cy.interceptBusinessContact().as('businessContact')
  cy.interceptBusinessSlim().as('businessApiCall')
  cy.visit(`/${businessIdentifier}/beneficial-owner-change?submissionType=` + submissionType)
  cy.wait(['@existingSIs', '@businessApiCall', '@payFeeApi', '@businessContact'])
})

Cypress.Commands.add('visitHomePageWithFakeDataAndAxeInject',
  (businessIdentifier?: string, submissionType?: SubmissionTypeE.CHANGE_FILING) => {
    cy.visitHomePageWithFakeData(businessIdentifier, submissionType)
    cy.injectAxe()
  })

Cypress.Commands.add('siSelectCitizenship', (citizenships: Array<BtrCountryI>) => {
  const isCitizen = citizenships.findIndex((country: BtrCountryI) => country.alpha_2 === 'CA') !== -1
  const isPr = citizenships.findIndex((country: BtrCountryI) => country.alpha_2 === 'CA_PR') !== -1
  if (isCitizen) {
    cy.get('input[data-cy="citizenships-ca-citizen-radio"]').check()
  } else if (isPr) {
    cy.get('input[data-cy="citizenships-ca-pr-radio"]').check()
  } else {
    cy.get('input[data-cy="citizenships-other-radio"]').check()
    cy.get('[data-cy="citizenshipsComboboxButton"]').click().then(
      () => {
        for (const country of citizenships) {
          cy.get('[id^="headlessui-combobox-options"]').contains(`${country.name}`).first().click({ force: true })
        }
      }
    )
  }
})

Cypress.Commands.add('addSingleTestSi', (profile: any) => {
  cy.get('[data-cy=add-new-btn]').click()
  cy.get('#individual-person-full-name').type(profile.fullName)
  cy.get('[data-cy=usePreferredName').check()
  cy.get('#individual-person-preferred-name').type(profile.preferredName)
  cy.get('#individual-person-email').type(profile.email)
  // todo: fixme: cleanup ticket #23553
  // todo: fixme: update on #20758
  // cy.get('[data-cy=testPercentOfShares]').click()
  // cy.get('[data-cy=testPercentOfShares]').find('li').first().click()
  // cy.get('[data-cy=testPercentOfVotes]').click()
  // cy.get('[data-cy=testPercentOfVotes]').find('li').first().click()
  // todo: fixme: update on #20756
  // cy.get('[data-cy="testTypeOfControl"]').get('[name="registeredOwner"]').check()
  // cy.get('[data-cy="testControlOfDirectors"]').get('[name="directControl"]').check()
  cy.get('[data-cy="start-date-select"]').click().then(() => {
    cy.get('.bcros-date-picker__calendar__day.dp__today').parent().click()
  })
  cy.get('#addNewPersonBirthdate').trigger('click')
  cy.get('[data-cy=date-picker]').get('.bcros-date-picker__calendar__day.dp__today').trigger('click')
  cy.get('[data-cy="address-country"]').click()
  cy.get('[data-cy="address-country"]').get('li').contains(profile.address.country).click()
  cy.get('[data-cy="address-line1-autocomplete"]').type(profile.address.streetAddress)
  cy.get('[data-cy="address-city"]').type(profile.address.city)
  cy.get('[data-cy="address-region-select"]').click()
  cy.get('[data-cy="address-region-select"]').get('li').contains(profile.address.province[0]).click()
  cy.get('[data-cy="address-postal-code"]').type(profile.address.postalCode)
  cy.get('[data-cy="phoneNumber.number"]').type(profile.phoneNumber.number)

  cy.siSelectCitizenship(profile.citizenships)

  cy.get('[data-cy="tax-number-input"]').type(profile.taxNumber)
  cy.get('[data-cy="testTaxResidency"]').get('[type="radio"][value="true"]').check()
  cy.get('[data-cy=new-si-done-btn]').click()
})

Cypress.Commands.add('addTestIndividuals', (multiple = true) => {
  cy.fixture('individuals').then((testData) => {
    cy.addSingleTestSi(testData.profile1)
    if (multiple) {
      cy.addSingleTestSi(testData.profile2)
    }
  })
})

Cypress.Commands.add('testMissingInfoRow', (index: number, text: string) => {
  cy.get('[data-cy="individualsSummaryTable"]')
    .find('tbody')
    .find('[data-cy="summary-table-row-missing-info"]').eq(Number(index))
    .should('exist')
    .find('td').as('items')
    .should('have.length', 2)
  cy.get('@items').eq(0).should('have.text', 'Unable to Obtain or Confirm Information')
  cy.get('@items').eq(1).as('info').should('contain.text', 'Steps taken')
  if (text.length < 200) {
    cy.get('@info').find('[data-cy="missing-info-text"]').should('have.text', text)
    cy.get('@info').find('[data-cy=missing-info-toggle-btn]').should('not.exist')
  } else {
    cy.get('@info').find('[data-cy="missing-info-text"]').as('text')
      .should('have.text', text.substring(0, 200))
    cy.get('@info').find('[data-cy=missing-info-toggle-btn]')
      .should('exist').as('toggleBtn')
      .should('have.text', 'More')
    // expand text
    cy.get('@toggleBtn').click()
    cy.get('@text').should('have.text', text)
    cy.get('@toggleBtn').should('have.text', 'Less')
    // back to minimize
    cy.get('@toggleBtn').click()
    cy.get('@text').should('have.text', text.substring(0, 200))
    cy.get('@toggleBtn').should('have.text', 'More')
  }
})
