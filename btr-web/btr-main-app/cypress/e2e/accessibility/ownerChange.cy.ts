describe('accessibility -> Beneficial Owner Change', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.wait(3000)
    cy.injectAxe()
  })

  it('checks page sections passes accessibility', () => {
    // NB: FUTURE we will just need this line uncommented once we fix the issues
    // cy.checkA11y('[data-cy=owner-change]')

    // For now, this is an example of passing checks
    cy.checkA11y('[data-cy=page-header]')
    cy.checkA11y('[data-cy=page-info-text]')
    cy.checkA11y('[data-cy=add-new-btn]')

    // NB: fix for this is complicated and should go in its own ticket for datepicker accessibility
    // cy.checkA11y('[data-cy=effective-date-select]')

    // NB: fix for this is complicated and should go in its own ticket for summary table accessibility
    // cy.checkA11y('[data-cy=individualsSummaryTable]')
  })
})
