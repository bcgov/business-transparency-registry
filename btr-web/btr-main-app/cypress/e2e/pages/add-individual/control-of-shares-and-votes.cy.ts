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

  it('test the error message for special characters', () => {
    cy.on('uncaught:exception', (err) => {
      expect(err.message).to.include(en.errors.validation.controlPercentage.specialCharacter)
      return false
    })

    cy.get('[data-cy="showAddIndividualPersonManually"]').trigger('click')
    cy.get('[name="percentOfShares"]').type('10ab').blur()
    cy.contains(en.errors.validation.controlPercentage.specialCharacter).should('exist')
    cy.get('[name="percentOfShares"]').clear().type('--').blur()
    cy.contains(en.errors.validation.controlPercentage.specialCharacter).should('exist')
    cy.get('[name="percentOfShares"]').clear().blur()
    cy.contains(en.errors.validation.controlPercentage.specialCharacter).should('not.exist')

    cy.get('[name="percentOfVotes"]').type('25.5').blur()
    cy.contains(en.errors.validation.controlPercentage.specialCharacter).should('exist')
    cy.get('[name="percentOfVotes"]').clear().type('-10').blur()
    cy.contains(en.errors.validation.controlPercentage.specialCharacter).should('exist')
    cy.get('[name="percentOfVotes"]').clear().blur()
    cy.contains(en.errors.validation.controlPercentage.specialCharacter).should('not.exist')
  })

  it('test the error message for leading zeros', () => {
    cy.on('uncaught:exception', (err) => {
      expect(err.message).to.include(en.errors.validation.controlPercentage.invalidFormat)
      return false
    })

    cy.get('[data-cy="showAddIndividualPersonManually"]').trigger('click')
    cy.get('[name="percentOfShares"]').type('0').blur()
    cy.contains(en.errors.validation.controlPercentage.invalidFormat).should('exist')
    cy.get('[name="percentOfShares"]').clear().type('012').blur()
    cy.contains(en.errors.validation.controlPercentage.invalidFormat).should('exist')
    cy.get('[name="percentOfShares"]').clear().blur()
    cy.contains(en.errors.validation.controlPercentage.invalidFormat).should('not.exist')

    cy.get('[name="percentOfVotes"]').type('0').blur()
    cy.contains(en.errors.validation.controlPercentage.invalidFormat).should('exist')
    cy.get('[name="percentOfVotes"]').clear().type('0012').blur()
    cy.contains(en.errors.validation.controlPercentage.invalidFormat).should('exist')
    cy.get('[name="percentOfVotes"]').clear().blur()
    cy.contains(en.errors.validation.controlPercentage.invalidFormat).should('not.exist')
  })

  it('test the error message for max value', () => {
    cy.on('uncaught:exception', (err) => {
      expect(err.message).to.include(en.errors.validation.controlPercentage.maxValueReached)
      return false
    })

    cy.get('[data-cy="showAddIndividualPersonManually"]').trigger('click')
    cy.get('[name="percentOfShares"]').type('101').blur()
    cy.contains(en.errors.validation.controlPercentage.maxValueReached).should('exist')
    cy.get('[name="percentOfShares"]').clear().type('100').blur()
    cy.contains(en.errors.validation.controlPercentage.maxValueReached).should('not.exist')

    cy.get('[name="percentOfVotes"]').type('120').blur()
    cy.contains(en.errors.validation.controlPercentage.maxValueReached).should('exist')
    cy.get('[name="percentOfVotes"]').clear().type('1').blur()
    cy.contains(en.errors.validation.controlPercentage.maxValueReached).should('not.exist')
  })
})
