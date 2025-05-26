import * as i18nCommon from '../../../../btr-common-components/i18n/locales/en.json'
import * as i18n from '../../../i18n/locales/en.json'
describe('pages -> Request To Omit', () => {
  // let i18nCommon: any
  // let i18n: any
  beforeEach(() => {
    // cy.readFile('../btr-common-components/i18n/locales/en.json').then((json) => { i18nCommon = json })
    // cy.readFile('i18n/locales/en.json').then((json) => { i18n = json })
    cy.visit('/request-to-omit')
  })

  it('rendered expected visuals', () => {
    cy.get('[data-cy="request-to-omit-header"]').should('contain', 'BC Business Transparency Registry')
    cy.get('[data-cy="request-to-omit-title"]')
      .should(
        'contain', 'Request to Omit Information'
      )
    cy.get('[data-cy="request-to-omit-text"]').should('contain',
      'You can request to have some or all of your information publicly omitted '
    )
  })

  it('Completing Party works as expected', () => {
    cy.get('#completingParty').should('exist')
    cy.get('#completing-party-full-name').should('exist')
    cy.get('#completing-party-email').should('exist')
    cy.get('[data-cy="certify-section"]').should('exist')
    cy.get('input[name="invididualType"]').should('exist')
  })

  it('Completing Party Validation checks', () => {
    cy.get('#completing-party-full-name').type('123')
    cy.contains(i18nCommon.errors.validation.fullName.specialCharacter).should('not.exist')
    cy.contains(i18nCommon.errors.validation.fullName.empty).should('not.exist')
    cy.get('#completing-party-full-name').clear()
    cy.contains(i18nCommon.errors.validation.fullName.specialCharacter).should('not.exist')
    cy.contains(i18nCommon.errors.validation.fullName.empty).should('exist')
    cy.get('#completing-party-full-name').type('John Doe')
    cy.contains(i18nCommon.errors.validation.fullName.specialCharacter).should('not.exist')
    cy.contains(i18nCommon.errors.validation.fullName.empty).should('not.exist')

    cy.get('#completing-party-email').type('123')
    cy.get('#completing-party-full-name').click()
    cy.contains(i18nCommon.errors.validation.email.invalid).should('exist')
    cy.contains(i18nCommon.errors.validation.email.empty).should('not.exist')
    cy.get('#completing-party-email').clear()
    cy.get('#completing-party-full-name').click()
    cy.contains(i18nCommon.errors.validation.email.invalid).should('not.exist')
    cy.contains(i18nCommon.errors.validation.email.empty).should('exist')
    cy.get('#completing-party-email').type('John@Doe.ca')
    cy.get('#completing-party-full-name').click()
    cy.contains(i18nCommon.errors.validation.email.invalid).should('not.exist')
    cy.contains(i18nCommon.errors.validation.email.empty).should('not.exist')

    cy.contains(i18n.errors.validation.certify).should('not.exist')
    cy.get('[data-cy="button-control-right-button"]').click()
    cy.contains(i18n.errors.validation.certify).should('exist')
    cy.get('[name="certification"]').click()
    cy.contains(i18n.errors.validation.certify).should('not.exist')
  })

  it('Biz Info works as expected', () => {
    cy.get('#si-biz-info-full-name').should('exist')
    cy.get('[name="birthdate"]').should('exist')
    cy.get('#si-biz-info-email').should('exist')
    cy.get('#businessId').should('exist')
  })

  it('Request to Omit works as expected', () => {
    cy.get('[name="omitAll"').should('exist')
    cy.get('[name="omitFULL_NAME"]').should('exist')
    cy.get('[name="omitBIRTH_YEAR"]').should('exist')
    cy.get('[name="omitCITIZENSHIP_PR"]').should('exist')
    cy.get('#omitSI').should('exist')
    cy.get('#omitHOUSEHOLD').should('exist')
    cy.get('[name="reasons"]').should('exist')
  })

  it('Biz Info Validaton checks', () => {
    cy.get('#si-biz-info-full-name').type('123')
    cy.contains(i18nCommon.errors.validation.fullName.specialCharacter).should('not.exist')
    cy.contains(i18nCommon.errors.validation.fullName.empty).should('not.exist')
    cy.get('#si-biz-info-full-name').clear()
    cy.contains(i18nCommon.errors.validation.fullName.specialCharacter).should('not.exist')
    cy.contains(i18nCommon.errors.validation.fullName.empty).should('exist')
    cy.get('#si-biz-info-full-name').type('John Doe')
    cy.contains(i18nCommon.errors.validation.fullName.specialCharacter).should('not.exist')
    cy.contains(i18nCommon.errors.validation.fullName.empty).should('not.exist')

    cy.get('#si-biz-info-email').type('123')
    cy.get('#si-biz-info-full-name').click()
    cy.contains(i18nCommon.errors.validation.email.invalid).should('exist')
    cy.contains(i18nCommon.errors.validation.email.empty).should('not.exist')
    cy.get('#si-biz-info-email').clear()
    cy.get('#si-biz-info-full-name').click()
    cy.contains(i18nCommon.errors.validation.email.invalid).should('not.exist')
    cy.contains(i18nCommon.errors.validation.email.empty).should('exist')
    cy.get('#si-biz-info-email').type('John@Doe.ca')
    cy.get('#si-biz-info-full-name').click()
    cy.contains(i18nCommon.errors.validation.email.invalid).should('not.exist')
    cy.contains(i18nCommon.errors.validation.email.empty).should('not.exist')

    cy.contains(i18n.errors.validation.businessId.required).should('not.exist')
    cy.contains(i18n.errors.validation.birthDate.required).should('not.exist')
    cy.get('[data-cy="button-control-right-button"]').click()
    cy.contains(i18n.errors.validation.birthDate.required).should('exist')
    cy.contains(i18n.errors.validation.businessId.required).should('exist')
  })
})
