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

  it('test the error message for special characters', () => {
    cy.on('uncaught:exception', (err) => {
      expect(err.message).to.include(en.errors.validation.controlPercentage.specialCharacter)
      return false
    })

    cy.get('[data-cy=add-new-btn]').trigger('click')
    // cy.get('[data-cy="showAddIndividualPersonManually"]').trigger('click')
    cy.get('[name="percentOfShares"]').type('10ab').blur()
    cy.contains(en.errors.validation.controlPercentage.specialCharacter).should('exist')
    cy.get('[name="percentOfShares"]').clear().type('--').blur()
    cy.contains(en.errors.validation.controlPercentage.specialCharacter).should('exist')
    cy.get('[name="percentOfShares"]').clear().blur()
    cy.contains(en.errors.validation.controlPercentage.specialCharacter).should('not.exist')

    // cy.get('[name="percentOfVotes"]').type('25.5').blur()
    // cy.contains(en.errors.validation.controlPercentage.specialCharacter).should('not.exist')
    cy.get('[name="percentOfVotes"]').clear().blur()
    cy.contains(en.errors.validation.controlPercentage.specialCharacter).should('not.exist')
  })

  it('test the error message for leading zeros', () => {
    cy.on('uncaught:exception', (err) => {
      expect(err.message).to.include(en.errors.validation.controlPercentage.invalidFormat)
      return false
    })

    cy.get('[data-cy=add-new-btn]').trigger('click')
    // cy.get('[data-cy="showAddIndividualPersonManually"]').trigger('click')
    cy.get('[name="percentOfShares"]').type('0').blur()
    cy.contains(en.errors.validation.controlPercentage.invalidPercentage).should('exist')
    cy.get('[name="percentOfShares"]').clear().type('012').blur()
    cy.contains(en.errors.validation.controlPercentage.invalidPercentage).should('exist')
    cy.get('[name="percentOfShares"]').clear().blur()
    cy.contains(en.errors.validation.controlPercentage.invalidPercentage).should('not.exist')

    cy.get('[name="percentOfVotes"]').type('0').blur()
    cy.contains(en.errors.validation.controlPercentage.invalidPercentage).should('exist')
    cy.get('[name="percentOfVotes"]').clear().type('0012').blur()
    cy.contains(en.errors.validation.controlPercentage.invalidPercentage).should('exist')
    cy.get('[name="percentOfVotes"]').clear().blur()
    cy.contains(en.errors.validation.controlPercentage.invalidPercentage).should('not.exist')
  })

  it('test the error message for invalid range', () => {
    cy.on('uncaught:exception', (err) => {
      expect(err.message).to.include(en.errors.validation.controlPercentage.invalidPercentage)
      return false
    })

    cy.get('[data-cy=add-new-btn]').trigger('click')
    // cy.get('[data-cy="showAddIndividualPersonManually"]').trigger('click')
    cy.get('[name="percentOfShares"]').type('101').blur()
    cy.contains(en.errors.validation.controlPercentage.invalidPercentage).should('exist')
    cy.get('[name="percentOfShares"]').clear().type('100').blur()
    cy.contains(en.errors.validation.controlPercentage.invalidPercentage).should('not.exist')

    cy.get('[name="percentOfVotes"]').type('120').blur()
    cy.contains(en.errors.validation.controlPercentage.invalidPercentage).should('exist')
    cy.get('[name="percentOfVotes"]').clear().type('1').blur()
    cy.contains(en.errors.validation.controlPercentage.invalidPercentage).should('not.exist')

    // Note: we might want to accept 0 in the future. For now, the valid range is [1, 100]
    cy.get('[name="percentOfShares"]').type('0').blur()
    cy.contains(en.errors.validation.controlPercentage.invalidPercentage).should('exist')
    cy.get('[name="percentOfShares"]').clear().type('-10').blur()
    cy.contains(en.errors.validation.controlPercentage.invalidPercentage).should('exist')
    cy.get('[name="percentOfVotes"]').clear().type('0').blur()
    cy.contains(en.errors.validation.controlPercentage.invalidPercentage).should('exist')
    cy.get('[name="percentOfVotes"]').clear().type('-2').blur()
    cy.contains(en.errors.validation.controlPercentage.invalidPercentage).should('exist')
  })
})
