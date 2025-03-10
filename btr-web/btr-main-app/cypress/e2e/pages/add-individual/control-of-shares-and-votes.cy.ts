describe('pages -> Add individual', () => {
  beforeEach(() => {
    cy.visitHomePageNoFakeData()
  })

  it('verify that the Type of Control checkboxes are working', () => {
    cy.get('[data-cy=add-new-btn]').trigger('click')

    cy.get('[name="controlOfShares.controlType"]').get('input[type="checkbox"]').check()
    cy.get('[data-cy="controlOfShares.registeredOwner"]').check().should('be.checked')
    cy.get('[data-cy="controlOfShares.beneficialOwner"]').check().should('be.checked')
    cy.get('[data-cy="controlOfShares.indirectControl"]').check().should('be.checked')

    cy.get('[name="controlOfVotes.controlType"]').get('input[type="checkbox"]').check()
    cy.get('[data-cy="controlOfVotes.registeredOwner"]').check().should('be.checked')
    cy.get('[data-cy="controlOfVotes.beneficialOwner"]').check().should('be.checked')
    cy.get('[data-cy="controlOfVotes.indirectControl"]').check().should('be.checked')
  })

  const verifyBgColorsControlOfVotes = (index: number) => {
    const nonSelected = [0, 1, 2, 3].filter(num => num !== index)
    if (index !== -1) {
      cy.get(`[data-cy="controlOfVotes.percentage.${index}"]`)
        .should('have.css', 'background-color')
        .and('eq', 'rgb(22, 105, 187)')
    }
    nonSelected.forEach((num) => {
      cy.get(`[data-cy="controlOfVotes.percentage.${num}"]`)
        .should('have.css', 'background-color')
        .and('eq', 'rgb(241, 243, 245)')
    })
  }

  it('test the percentage selector', () => {
    cy.get('[data-cy=add-new-btn]').trigger('click')

    // it works same for shares as it is same component
    cy.get('[data-cy="controlOfVotes.percentage.0"]').click()
    verifyBgColorsControlOfVotes(0)
    cy.get('[data-cy="controlOfVotes.percentage.1"]').click()
    verifyBgColorsControlOfVotes(1)
    cy.get('[data-cy="controlOfVotes.percentage.2"]').click()
    verifyBgColorsControlOfVotes(2)
    cy.get('[data-cy="controlOfVotes.percentage.3"]').click()
    verifyBgColorsControlOfVotes(3)

    // test can unselect
    cy.get('[data-cy="controlOfVotes.percentage.3"]').click()
    verifyBgColorsControlOfVotes(-1)
  })
})
