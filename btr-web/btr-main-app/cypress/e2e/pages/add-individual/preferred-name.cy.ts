import business from '../../../fixtures/business.json'
import json from '../../../../../btr-common-components/i18n/locales/en.json'

describe('pages -> Add individual -- preferred name', () => {
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

  it('checks the preferred name section is working as expected', () => {
    cy.get('[data-cy=add-new-btn]').trigger('click')

    cy.get('[data-cy="usePreferredName"]').should('not.be.checked')
    cy.get('[data-cy="testPreferredName"]').should('not.exist')
    cy.get('[data-cy="usePreferredName"]').click()
    cy.get('[data-cy="testPreferredName"]').should('exist')
    cy.get('[data-cy="testPreferredName"] input').focus()
    cy.get('[data-cy="testPreferredName"] input').blur()
    cy.contains(i18nCommon.errors.validation.preferredName.empty).should('not.exist')

    cy.get('[data-cy="testPreferredName"] input').type('TestName2')
    cy.get('[data-cy="testPreferredName"] input').blur()
    cy.contains(i18nCommon.errors.validation.preferredName.specialCharacter).should('not.exist')
  })
})
