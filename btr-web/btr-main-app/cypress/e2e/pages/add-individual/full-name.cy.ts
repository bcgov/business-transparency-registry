import json from '../../../../../btr-main-app/i18n/locales/en.json'

describe('pages -> Add individual -- preferred name', () => {
  const i18nCommon = json
  beforeEach(() => {
    // setup intercepts
    cy.visitHomePageWithFakeDataAndAxeInject()
  })

  it('Reason for name change verification', () => {
    cy.get('[data-cy="action-button"]').first().click()

    cy.get('[data-cy="name-change-reason-radio-other"]').should('not.exist')

    cy.get('input[data-cy="testFullName"]').focus()
    cy.get('input[data-cy="testFullName"]').type(' 123')
    cy.contains(i18nCommon.labels.nameChangeReason.title)
    cy.get('[data-cy="name-change-reason-radio-other"]').should('exist')
    cy.get('button[data-cy=new-si-done-btn]').focus().click()
    cy.contains(i18nCommon.errors.validation.nameChangeReason.empty).should('exist')
    cy.get('input[data-cy="name-change-reason-radio-other"]').first().check()

    // clear the description modal
    cy.get('[data-cy="declaration-modal-button-confirm"]').click()

    cy.contains(i18nCommon.errors.validation.nameChangeReason.empty).should('not.exist')
  })
})
