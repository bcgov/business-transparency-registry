import business from '../../../fixtures/business.json'
import json from '../../../../../btr-common-components/i18n/locales/en.json'
import specificJson from '../../../../../btr-main-app/i18n/locales/en.json'

describe('pages -> Add individual', () => {
  const i18nCommon = json
  const i18nSpecific = specificJson
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

    cy.contains(i18nCommon.errors.validation.fullName.empty).should('not.exist')

    cy.get('[data-cy="testFullName"] input').focus()
    cy.get('[data-cy="testFullName"] input').blur()
    cy.contains(i18nCommon.errors.validation.fullName.empty).should('exist')

    // make sure no button selected
    cy.get('[data-cy="declaration-button-me"]').should('have.class', 'bg-gray-50')
    cy.get('[data-cy="declaration-button-parent"]').should('have.class', 'bg-gray-50')
    cy.get('[data-cy="declaration-button-lawyer"]').should('have.class', 'bg-gray-50')
    cy.get('[data-cy="declaration-button-none"]').should('have.class', 'bg-gray-50')

    cy.get('[data-cy="declaration-button-me"]').click()
    cy.get('[data-cy="declaration-button-me"]').should('have.class', 'bg-primary-500')
    cy.get('[data-cy="declaration-button-parent"]').should('have.class', 'bg-gray-50')
    cy.get('[data-cy="declaration-button-lawyer"]').should('have.class', 'bg-gray-50')
    cy.get('[data-cy="declaration-button-none"]').should('have.class', 'bg-gray-50')
    cy.contains(i18nCommon.errors.validation.fullName.empty).should('not.exist')
    cy.contains(i18nSpecific.errors.validation.declaration).should('not.exist')
    cy.get('[data-cy="declaration-button-me"]').click()
    cy.contains(i18nSpecific.errors.validation.declaration).should('exist')
    cy.get('[data-cy="declaration-button-me"]').should('have.class', 'bg-gray-50')

    cy.get('[data-cy="declaration-button-parent"]').click()
    cy.get('[data-cy="declaration-button-me"]').should('have.class', 'bg-gray-50')
    cy.get('[data-cy="declaration-button-parent"]').should('have.class', 'bg-primary-500')
    cy.get('[data-cy="declaration-button-lawyer"]').should('have.class', 'bg-gray-50')
    cy.get('[data-cy="declaration-button-none"]').should('have.class', 'bg-gray-50')
    cy.contains(i18nCommon.errors.validation.fullName.empty).should('exist')
    cy.contains(i18nSpecific.errors.validation.declaration).should('not.exist')
    cy.get('[data-cy="declaration-button-parent"]').click()
    cy.contains(i18nSpecific.errors.validation.declaration).should('exist')
    cy.get('[data-cy="declaration-button-parent"]').should('have.class', 'bg-gray-50')

    cy.get('[data-cy="declaration-button-lawyer"]').click()
    cy.get('[data-cy="declaration-button-me"]').should('have.class', 'bg-gray-50')
    cy.get('[data-cy="declaration-button-parent"]').should('have.class', 'bg-gray-50')
    cy.get('[data-cy="declaration-button-lawyer"]').should('have.class', 'bg-primary-500')
    cy.get('[data-cy="declaration-button-none"]').should('have.class', 'bg-gray-50')
    cy.contains(i18nCommon.errors.validation.fullName.empty).should('exist')
    cy.contains(i18nSpecific.errors.validation.declaration).should('not.exist')
    cy.get('[data-cy="declaration-button-lawyer"]').click()
    cy.contains(i18nSpecific.errors.validation.declaration).should('exist')
    cy.get('[data-cy="declaration-button-lawyer"]').should('have.class', 'bg-gray-50')

    cy.get('[data-cy="declaration-button-none"]').click()
    cy.get('[data-cy="declaration-button-me"]').should('have.class', 'bg-gray-50')
    cy.get('[data-cy="declaration-button-parent"]').should('have.class', 'bg-gray-50')
    cy.get('[data-cy="declaration-button-lawyer"]').should('have.class', 'bg-gray-50')
    cy.get('[data-cy="declaration-button-none"]').should('have.class', 'bg-primary-500')
    cy.contains(i18nCommon.errors.validation.fullName.empty).should('exist')
    cy.contains(i18nSpecific.errors.validation.declaration).should('not.exist')
    cy.get('[data-cy="declaration-button-none"]').click()
    cy.contains(i18nSpecific.errors.validation.declaration).should('exist')
    cy.get('[data-cy="declaration-button-none"]').should('have.class', 'bg-gray-50')
  })
})
