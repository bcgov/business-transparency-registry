import business from '../../../fixtures/business.json'
import json from '../../../../../btr-common-components/i18n/locales/en.json'
import specificJson from '../../../../../btr-main-app/lang/en.json'

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

    cy.get('[data-cy="testFullName"] input').type('TestFirst2')
    cy.get('[data-cy="testFullName"] input').blur()
    cy.contains(i18nCommon.errors.validation.fullName.specialCharacter).should('not.exist')

    // make sure no button selected
    cy.get('[data-cy="declaration-button-me"]').invoke('attr', 'class').should('contain', 'gray')
    cy.get('[data-cy="declaration-button-parent"]').invoke('attr', 'class').should('contain', 'gray')
    cy.get('[data-cy="declaration-button-lawyer"]').invoke('attr', 'class').should('contain', 'gray')
    cy.get('[data-cy="declaration-button-none"]').invoke('attr', 'class').should('contain', 'gray')

    cy.get('[data-cy="declaration-button-me"]').click()
    cy.get('[data-cy="declaration-button-me"]').invoke('attr', 'class').should('contain', 'primary')
    cy.get('[data-cy="declaration-button-parent"]').invoke('attr', 'class').should('contain', 'gray')
    cy.get('[data-cy="declaration-button-lawyer"]').invoke('attr', 'class').should('contain', 'gray')
    cy.get('[data-cy="declaration-button-none"]').invoke('attr', 'class').should('contain', 'gray')
    cy.contains(i18nCommon.errors.validation.fullName.empty).should('not.exist')
    cy.contains(i18nSpecific.errors.validation.declaration).should('not.exist')
    cy.get('[data-cy="declaration-button-me"]').click()
    cy.contains(i18nSpecific.errors.validation.declaration).should('exist')
    cy.get('[data-cy="declaration-button-me"]').invoke('attr', 'class').should('contain', 'gray')

    cy.get('[data-cy="declaration-button-parent"]').click()
    cy.get('[data-cy="declaration-button-me"]').invoke('attr', 'class').should('contain', 'gray')
    cy.get('[data-cy="declaration-button-parent"]').invoke('attr', 'class').should('contain', 'primary')
    cy.get('[data-cy="declaration-button-lawyer"]').invoke('attr', 'class').should('contain', 'gray')
    cy.get('[data-cy="declaration-button-none"]').invoke('attr', 'class').should('contain', 'gray')
    cy.contains(i18nCommon.errors.validation.fullName.empty).should('exist')
    cy.contains(i18nSpecific.errors.validation.declaration).should('not.exist')
    cy.get('[data-cy="declaration-button-parent"]').click()
    cy.contains(i18nSpecific.errors.validation.declaration).should('exist')
    cy.get('[data-cy="declaration-button-parent"]').invoke('attr', 'class').should('contain', 'gray')

    cy.get('[data-cy="declaration-button-lawyer"]').click()
    cy.get('[data-cy="declaration-button-me"]').invoke('attr', 'class').should('contain', 'gray')
    cy.get('[data-cy="declaration-button-parent"]').invoke('attr', 'class').should('contain', 'gray')
    cy.get('[data-cy="declaration-button-lawyer"]').invoke('attr', 'class').should('contain', 'primary')
    cy.get('[data-cy="declaration-button-none"]').invoke('attr', 'class').should('contain', 'gray')
    cy.contains(i18nCommon.errors.validation.fullName.empty).should('exist')
    cy.contains(i18nSpecific.errors.validation.declaration).should('not.exist')
    cy.get('[data-cy="declaration-button-lawyer"]').click()
    cy.contains(i18nSpecific.errors.validation.declaration).should('exist')
    cy.get('[data-cy="declaration-button-lawyer"]').invoke('attr', 'class').should('contain', 'gray')

    cy.get('[data-cy="declaration-button-none"]').click()
    cy.get('[data-cy="declaration-button-me"]').invoke('attr', 'class').should('contain', 'gray')
    cy.get('[data-cy="declaration-button-parent"]').invoke('attr', 'class').should('contain', 'gray')
    cy.get('[data-cy="declaration-button-lawyer"]').invoke('attr', 'class').should('contain', 'gray')
    cy.get('[data-cy="declaration-button-none"]').invoke('attr', 'class').should('contain', 'primary')
    cy.contains(i18nCommon.errors.validation.fullName.empty).should('exist')
    cy.contains(i18nSpecific.errors.validation.declaration).should('not.exist')
    cy.get('[data-cy="declaration-button-none"]').click()
    cy.contains(i18nSpecific.errors.validation.declaration).should('exist')
    cy.get('[data-cy="declaration-button-none"]').invoke('attr', 'class').should('contain', 'gray')
  })
})
