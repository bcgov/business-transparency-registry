describe('pages -> Add individual', () => {
  let en: any

  beforeEach(() => {
    // load the English version of the language file
    cy.readFile('lang/en.json').then((json) => {
      en = json
    })

    cy.visit('/')
  })

  it('verify Tax Number component is working', () => {
    cy.get('[data-cy="add-new-btn"]').trigger('click')

    // ensure the input box and the checkbox are visible
    cy.get('[data-cy="tax-number-input"]').should('exist')
    cy.get('[data-cy="no-tax-number-checkbox"]').should('exist')

    // check the no-tax-number checkbox
    cy.get('[data-cy="no-tax-number-checkbox"]').check()
    cy.get('[data-cy="no-tax-number-checkbox"]').should('be.checked')

    // when some value is entered in the tax number input box, the checkbox should be unchecked
    cy.get('[data-cy="tax-number-input"]').type('000').blur()
    cy.get('[data-cy="no-tax-number-checkbox"]').should('not.be.checked')

    // checking the checkbox again should clear the input box
    cy.get('[data-cy="no-tax-number-checkbox"]').check()
    cy.get('[data-cy="no-tax-number-checkbox"]').should('be.checked')
    cy.get('[data-cy="tax-number-input"]').should('have.value', '')
  })

  it('test the error message for tax number length', () => {
    cy.on('uncaught:exception', (err) => {
      expect(err.message).to.include(en.errors.validation.taxNumber.invalidLength)
      return false
    })

    cy.get('[data-cy="add-new-btn"]').trigger('click')
    cy.get('[data-cy="tax-number-input"]').type('00').blur()
    cy.contains(en.errors.validation.taxNumber.invalidLength).should('exist')
  })

  it('test the error message for special characters in tax number', () => {
    cy.on('uncaught:exception', (err) => {
      expect(err.message).to.include(en.errors.validation.taxNumber.specialCharacter)
      return false
    })

    cy.get('[data-cy="add-new-btn"]').trigger('click')
    cy.get('[data-cy="tax-number-input"]').type('a').blur()
    cy.contains(en.errors.validation.taxNumber.specialCharacter).should('exist')
  })

  it('test the error message for invalid tax number', () => {
    cy.on('uncaught:exception', (err) => {
      expect(err.message).to.include(en.errors.validation.taxNumber.invalidNumber)
      return false
    })

    cy.get('[data-cy=add-new-btn]').trigger('click')
    cy.get('[data-cy="tax-number-input"]').type('111222333').blur()
    cy.contains(en.errors.validation.taxNumber.invalidNumber).should('exist')
  })
})
