describe('pages -> Add individual', () => {
  let en: any

  beforeEach(() => {
    // load the English version of the language file
    cy.readFile('lang/en.json').then((json) => {
      en = json
    })

    cy.visit('/')
  })

  it('verify the control of director component is working', () => {
    cy.get('[data-cy=add-new-btn]').trigger('click')
    // cy.get('[data-cy="showAddIndividualPersonManually"]').trigger('click')

    const checkboxes = cy.get('[data-cy="testControlOfDirectors"]').should('exist')

    checkboxes.get('[name="directControl"]').check().should('be.checked')
    checkboxes.get('[name="indirectControl"]').check().should('be.checked')
    checkboxes.get('[name="significantInfluence"]').check().should('be.checked')
    checkboxes.get('[name="inConcertControl"]').check().should('be.checked')
  })

  it('test the tooltip', () => {
    cy.get('[data-cy=add-new-btn]').trigger('click')
    // cy.get('[data-cy="showAddIndividualPersonManually"]').trigger('click')

    const checkboxes = cy.get('[data-cy="testControlOfDirectors"]').should('exist')

    checkboxes.get('[data-cy="testControlOfDirectorsTooltip"]').trigger('mouseover')
    cy.contains(en.texts.sharesAndVotes.inConcertControl.tooltipContent).should('exist')
  })
})
