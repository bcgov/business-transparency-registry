import payFeesForBtrRegsigin from '../../fixtures/payFeeForBtrRegsigin.json'

describe('pages -> Review and Confirm', () => {
  beforeEach(() => {
    cy.visit('/BC0871427/beneficial-owner-change/review-confirm')
  })

  it('verify pay fee widget is visible and base state is available', () => {
    cy.viewport(2560, 1440)
    cy.intercept(
      'GET',
      'https://pay-api-dev.apps.silver.devops.gov.bc.ca/api/v1/fees/BTR/REGSIGIN',
      { data: payFeesForBtrRegsigin })

    // check base state exists and contains - for no items
    cy.get('[data-cy="pay-fees-widget-empty-fees"]').contains('-')

    // check totals line footer exists and has - denoting no items are present
    cy.get('[data-cy="pay-fees-widget-total"]').contains('-')
  })
})
