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
    cy.get('[data-cy="showAddIndividualPersonManually"]').trigger('click')

    const checkboxes = cy.get('[data-cy="testTypeOfControl"]').should('exist')

    checkboxes.get('[name="registeredOwner"]').check().should('be.checked')
    checkboxes.get('[name="beneficialOwner"]').check().should('be.checked')
    checkboxes.get('[name="indirectControl"]').check().should('be.checked')
  })

  it('test the error message for the percent of shares', () => {
    cy.on('uncaught:exception', (err) => {
      expect(err.message).to.include(en.errors.validation.controlPercentage.invalidPercentage)
      return false
    })

    cy.get('[data-cy="showAddIndividualPersonManually"]').trigger('click')
    cy.get('[name="percentOfShares"]').type('101').blur()
    cy.contains(en.errors.validation.controlPercentage.invalidPercentage).should('exist')
    cy.get('[name="percentOfShares"]').clear().type('100').blur()
    cy.contains(en.errors.validation.controlPercentage.invalidPercentage).should('not.exist')
    cy.get('[name="percentOfShares"]').clear().type('1').blur()
    cy.contains(en.errors.validation.controlPercentage.invalidPercentage).should('not.exist')
    cy.get('[name="percentOfShares"]').clear().type('0').blur()
    cy.contains(en.errors.validation.controlPercentage.invalidPercentage).should('exist')
    cy.get('[name="percentOfShares"]').clear().type('text').blur()
    cy.contains(en.errors.validation.controlPercentage.invalidPercentage).should('exist')
  })

  it('test the error message for the percent of votes', () => {
    cy.on('uncaught:exception', (err) => {
      expect(err.message).to.include(en.errors.validation.controlPercentage.invalidPercentage)
      return false
    })

    cy.get('[data-cy="showAddIndividualPersonManually"]').trigger('click')
    cy.get('[name="percentOfVotes"]').type('101').blur()
    cy.contains(en.errors.validation.controlPercentage.invalidPercentage).should('exist')
    cy.get('[name="percentOfVotes"]').clear().type('100').blur()
    cy.contains(en.errors.validation.controlPercentage.invalidPercentage).should('not.exist')
    cy.get('[name="percentOfVotes"]').clear().type('1').blur()
    cy.contains(en.errors.validation.controlPercentage.invalidPercentage).should('not.exist')
    cy.get('[name="percentOfVotes"]').clear().type('0').blur()
    cy.contains(en.errors.validation.controlPercentage.invalidPercentage).should('exist')
    cy.get('[name="percentOfVotes"]').clear().type('text').blur()
    cy.contains(en.errors.validation.controlPercentage.invalidPercentage).should('exist')
  })
})
