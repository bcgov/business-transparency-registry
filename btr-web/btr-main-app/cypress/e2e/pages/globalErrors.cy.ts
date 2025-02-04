import json from '../../../../btr-main-app/lang/en.json'


describe('Displaying global errors', () => {
  const i18nMain = json

  it('Show Error modal on 500', () => {
    cy.intercept(
      'GET',
      '/plots/entity/BC0871427',
      { statusCode: 500, body: { error: 'Something went wrong', message: 'Error fetching data' } }
    ).as('existingSIs')

    cy.interceptPayFeeApi().as('payFeeApi')
    cy.interceptBusinessContact().as('businessContact')
    cy.interceptBusinessSlim().as('businessApiCall')
    cy.visit('/')
    cy.wait(['@existingSIs', '@businessApiCall', '@payFeeApi', '@businessContact'])

    cy.get('[data-cy="bcros-dialog-header"]').should('be.visible')
    cy.get('[data-cy="bcros-dialog-footer"]').should('be.visible')

    cy.get('[data-cy="bcros-dialog-header-close-btn"]').should('be.visible').click()

    cy.get('[data-cy="bcros-dialog"]').should('not.exist')
    cy.get('[data-cy="bcros-dialog-header"]').should('not.exist')
    cy.get('[data-cy="bcros-dialog-footer"]').should('not.exist')
  })
})
