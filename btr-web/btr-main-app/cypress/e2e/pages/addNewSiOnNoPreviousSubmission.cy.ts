describe('Add SI when no existing SI submissions exist for the business', () => {
  it('Add new and verify it can move to submit & review page', () => {
    cy.fixture('individuals').then((testData) => {
      cy.visitHomePageNoPreviousSiSubmissions()

      // click 'Add an Individual' button and expand the form
      cy.get('[data-cy=add-new-btn]').click()

      cy.fillOutForm(testData.profile1)

      // click 'Done' button to add the individual
      cy.get('[data-cy=new-si-done-btn]').click()

      // click 'Review and Confirm' button to review the summary'
      cy.get('[data-cy="button-control-right-button"]').click()

      // verify the url changes to /review-confirm
      cy.url().should('include', '/review-confirm')
    })
  })
})
