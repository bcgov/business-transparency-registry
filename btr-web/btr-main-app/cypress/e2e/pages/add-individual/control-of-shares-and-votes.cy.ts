describe('pages -> Add individual', () => {
  let en: any

  beforeEach(() => {
    // load the English version of the language file
    cy.readFile('lang/en.json').then((json) => {
      en = json
    })

    cy.visit('/')
  })

  it('verify that the Type of Control checkboxes are working', () => {
    cy.get('[data-cy=add-new-btn]').trigger('click')
    // cy.get('[data-cy="showAddIndividualPersonManually"]').trigger('click')

    const checkboxes = cy.get('[data-cy="testTypeOfControl"]').should('exist')

    checkboxes.get('[name="inConcertControl"]').check().should('be.checked')
    checkboxes.get('[name="registeredOwner"]').check().should('be.checked')
    checkboxes.get('[name="beneficialOwner"]').check().should('be.checked')
    checkboxes.get('[name="indirectControl"]').check().should('be.checked')
  })

  it('test the tooltip for in-concert control', () => {
    cy.get('[data-cy=add-new-btn]').trigger('click')
    // cy.get('[data-cy="showAddIndividualPersonManually"]').trigger('click')

    cy.get('[data-cy="in-concert-control-tooltip"]').trigger('mouseenter')
    cy.get('[data-cy="in-concert-control-tooltip-content"').should('exist')
    cy.get('[data-cy="in-concert-control-tooltip"]').trigger('mouseleave')
    cy.get('[data-cy="in-concert-control-tooltip-content"').should('not.exist')
  })

  it('test the dropdown menu for percent of shares', () => {
    cy.get('[data-cy=add-new-btn]').trigger('click')

    const shareRange1 = en.texts.sharesAndVotes.percentageRange.moreThan75.replace('{sharesOrVotes}', 'shares')
    const shareRange2 = en.texts.sharesAndVotes.percentageRange.between25And50.replace('{sharesOrVotes}', 'shares')
    cy.get('[data-cy=testPercentOfShares]').click().find('li').eq(0).click()
    cy.get('input[name="percentOfShares[label]"]').invoke('val').should('eq', shareRange1)
    cy.get('input[name="percentOfShares[label]"]').invoke('val').should('not.eq', shareRange2)
    cy.get('[data-cy=testPercentOfShares]').click().find('li').eq(2).click()
    cy.get('input[name="percentOfShares[label]"]').invoke('val').should('eq', shareRange2)
    cy.get('input[name="percentOfShares[label]"]').invoke('val').should('not.eq', shareRange1)
  })
})
