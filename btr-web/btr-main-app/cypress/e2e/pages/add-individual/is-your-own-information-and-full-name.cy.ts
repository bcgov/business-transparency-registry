import business from '../../../fixtures/business.json'
import json from '../../../../../btr-common-components/lang/en.json'

describe('pages -> Add individual', () => {
  const i18nCommon = json
  beforeEach(() => {
    // setup intercepts
    cy.interceptPostsBtrApi().as('existingSIs')
    cy.interceptPayFeeApi().as('payFeeApi')
    cy.interceptBusinessContact().as('businessContact')
    cy.interceptBusinessSlim().as('businessApiCall')

    sessionStorage.setItem('FAKE_LOGIN', 'true')
    cy.visit(`/${business.identifier}/beneficial-owner-change`)
    cy.wait(['@existingSIs', '@businessApiCall', '@payFeeApi', '@businessContact'])
  })

  it('checks sections is your information and name are working as expected', () => {
    cy.get('[data-cy=add-new-btn]').trigger('click')

    cy.get('[data-cy="isYourOwnInformation-checkbox"]').should('not.be.checked')

    cy.contains(i18nCommon.errors.validation.fullName.empty).should('not.exist')

    cy.get('[data-cy="testFullName"] input').focus()
    cy.get('[data-cy="testFullName"] input').blur()
    cy.contains(i18nCommon.errors.validation.fullName.empty).should('exist')

    cy.get('[data-cy="testFullName"] input').type('TestFirst2')
    cy.get('[data-cy="testFullName"] input').blur()
    cy.contains(i18nCommon.errors.validation.fullName.specialCharacter).should('exist')

    cy.get('[data-cy="isYourOwnInformation-checkbox"]').check()
    cy.contains(i18nCommon.errors.validation.fullName.specialCharacter).should('not.exist')
  })
})
