describe('pages -> Add individual', () => {
  beforeEach(() => {
    // load the English version of the language file
    cy.readFile('lang/en.json').then((json) => {
      en = json
    })

    cy.visit('/')
  })

  it('verify TaxResidency component is working', () => {
    cy.get('[data-cy="showAddIndividualPersonManually"]').trigger('click')

    const checkboxes = cy.get('[data-cy="testControlOfDirectors"]').should('exist')

    checkboxes.get('[name="directControl"]').check().should('be.checked')
    checkboxes.get('[name="indirectControl"]').check().should('be.checked')
    checkboxes.get('[name="significantInfluence"]').check().should('be.checked')
  })
})
