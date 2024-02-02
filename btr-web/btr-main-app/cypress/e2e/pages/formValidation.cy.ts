import { dateToString } from '../../../../btr-common-components/utils/date'
import payFeesForBtrRegsigin from '../../fixtures/payFeeForBtrRegsigin.json'

describe('pages -> Beneficial Owner Change', () => {
  let i18nCommon: any
  let i18n: any
  beforeEach(() => {
    cy.readFile('/Users/peinanwang/Work/business-transparency-registry/btr-web/btr-common-components/lang/en.json')
      .then((json) => {
        i18nCommon = json
      })
    cy.readFile('/Users/peinanwang/Work/business-transparency-registry/btr-web/btr-main-app/lang/en.json')
      .then((json) => {
        i18n = json
      })
    cy.visit('/')
    cy.wait(1000)

    cy.intercept(
      'GET',
      'https://pay-api-dev.apps.silver.devops.gov.bc.ca/api/v1/fees/BTR/REGSIGIN',
      { data: payFeesForBtrRegsigin })
  })

  it('Validations are applied throughout the form', () => {
    // Click the Done button without filling out the form
    cy.get('[data-cy=add-new-btn]').click()
    cy.get('[data-cy=new-si-done-btn]').click()

    // Check for all the error messages
    cy.contains(i18nCommon.errors.validation.fullName.empty).should('exist')
    cy.contains(i18nCommon.errors.validation.email.empty).should('exist')
    cy.contains(i18n.errors.validation.controlPercentage.empty).should('not.exist')
    cy.contains(i18n.errors.validation.sharesAndVotes.required).should('not.exist')
    cy.contains(i18n.errors.validation.controlOfDirectors.required).should('not.exist')
    cy.contains(i18n.errors.validation.birthDate.required).should('exist')
    cy.contains(i18n.errors.validation.citizenship.required).should('exist')
    cy.contains(i18n.errors.validation.address.country).should('exist')
    cy.contains(i18n.errors.validation.address.line1).should('exist')
    cy.contains(i18n.errors.validation.address.city).should('exist')
    cy.contains(i18n.errors.validation.address.region).should('exist')
    cy.contains(i18n.errors.validation.address.postalCode).should('exist')
    cy.contains(i18n.errors.validation.taxNumber.required).should('exist')
    cy.contains(i18n.errors.validation.taxResidency.required).should('exist')
    cy.contains(i18n.errors.validation.missingInfoReason.required).should('not.exist')
  })

  it('Form validation for Citizenship', () => {
    cy.get('[data-cy=add-new-btn]').click()
    cy.get('[data-cy=new-si-done-btn]').click()
    cy.contains(i18n.errors.validation.citizenship.required).should('exist')

    // Selecting "Canadian citizenship" should remove the error
    cy.get('[data-cy="countryOfCitizenshipRadioGroup"]').get('[type="radio"][value="citizen"]').check()
    cy.contains(i18n.errors.validation.citizenship.required).should('not.exist')

    // Checking "Other" without selecting countries should trigger an error
    cy.get('[data-cy="countryOfCitizenshipRadioGroup"]').get('[type="radio"][value="other"]').check()
    cy.get('[data-cy=new-si-done-btn]').click()
    cy.contains(i18n.errors.validation.citizenship.required).should('not.exist')
    cy.contains(i18n.errors.validation.citizenship.otherCountry).should('exist')

    // Select the first foreign country
    cy.get('[data-cy="countryOfCitizenshipDropdownButton"]').click()
    cy.get('[data-cy="countryOfCitizenshipDropdownOption"]').first().click({ force: true })
    cy.contains(i18n.errors.validation.citizenship.otherCountry).should('not.exist')
  })

  it('Form validation for Control of Shares and Votes', () => {
    cy.get('[data-cy=add-new-btn]').click()
    cy.get('[data-cy=new-si-done-btn]').click()
    cy.contains(i18n.errors.validation.controlPercentage.empty).should('not.exist')
    cy.contains(i18n.errors.validation.sharesAndVotes.required).should('not.exist')

    // TO-DO more tests convering all the validation rules for the percentage of shares and votes
    // and the control types.
  })
})
