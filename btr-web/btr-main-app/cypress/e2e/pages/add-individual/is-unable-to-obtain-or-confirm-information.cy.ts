describe('pages -> Add individual', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('renders the isUnableToObtainOrConfirmInformation section and all basic boxes show on trigger', () => {
    cy.get('[data-cy=add-new-btn]').trigger('click')
    cy.get('[data-cy="showAddIndividualPersonManually"]').trigger('click')

    // find section div
    cy.get('[data-cy="isUnableToObtainOrConfirmInformation"]')

    // make sure alert does not exist
    cy.get('[data-cy="alertsMessage:alert"]').should('not.exist')

    // find checkbox
    cy.get('[data-cy="isUnableToObtainOrConfirmInformationCheckbox"]')

    // make sure checkbox not checked
    cy.get('[data-cy="isUnableToObtainOrConfirmInformationCheckbox"]').should('not.be.checked')

    // find textarea
    cy.get('[data-cy="isUnableToObtainOrConfirmInformationTextArea"]')

    // write in text area and switch it
    cy.get('[data-cy="isUnableToObtainOrConfirmInformationTextArea"] >> textarea').type('test').blur()

    // make sure checkbox got checked
    cy.get('[data-cy="isUnableToObtainOrConfirmInformationCheckbox"]').should('be.checked')

    // make sure alert is showing up
    cy.get('[data-cy="alertsMessage:alert"]')
  })
})
