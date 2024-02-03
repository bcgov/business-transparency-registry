describe('pages -> Add individual', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('renders the External Influence section and default radio is selected', () => {
    cy.get('[data-cy=add-new-btn]').click()

    // top level 'external influence' container showing up
    cy.get('[data-cy="significant-individual-external-influence"]')

    //  radio buttons showing up
    cy.get('[data-cy="external-influence-radio-no-influence"]')
      .should('be.checked')
    cy.get('[data-cy="external-influence-radio-can-influence"]')
      .should('not.be.checked')
    cy.get('[data-cy="external-influence-radio-can-be-influenced"]')
      .should('not.be.checked')

    // click not checked
    cy.get('[data-cy="external-influence-radio-can-be-influenced"]')
      .click()

    cy.get('[data-cy="external-influence-radio-no-influence"]')
      .should('not.be.checked')
    cy.get('[data-cy="external-influence-radio-can-influence"]')
      .should('not.be.checked')
    cy.get('[data-cy="external-influence-radio-can-be-influenced"]')
      .should('be.checked')

    // verify correct parts are bolded
    cy.get('[data-cy="i18n-bold-helper-labels.externalInfluence.noInfluence"]')
      .contains('There is <strong>no written agreement</strong>' +
        ' involving influence of, or by, this individual and another individual regarding control of the business.')
    cy.get('[data-cy="i18n-bold-helper-labels.externalInfluence.canInfluence"]')
      .contains('A written agreement <strong>allows this individual</strong>' +
        ' to direct or influence another individual’s decision making')
    cy.get('[data-cy="i18n-bold-helper-labels.externalInfluence.canBeInfluenced"]')
      .contains('A written agreement <strong>allows another individual</strong>' +
        ' to direct or influence this individual’s decision making')
  })
})
