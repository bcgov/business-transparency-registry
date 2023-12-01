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
    cy.get('[data-cy=add-new-btn]').trigger('click')
    cy.get('[data-cy="showAddIndividualPersonManually"]').trigger('click')

    const radioGroup = cy.get('[data-cy="testTaxNumber"]').should('exist')

    radioGroup.get('[type="radio"][value="noTaxNumber"]').check().should('be.checked')
  })

  it('test the error message for tax number length', () => {
    cy.on('uncaught:exception', (err) => {
      expect(err.message).to.include(en.errors.validation.taxNumber.invalidLength)
      return false
    })

    cy.get('[data-cy=add-new-btn]').trigger('click')
    cy.get('[data-cy="showAddIndividualPersonManually"]').trigger('click')
    cy.get('[name="taxNumber"]').type('00').blur()
    cy.contains(en.errors.validation.taxNumber.invalidLength).should('exist')
    cy.get('[type="radio"][value="hasTaxNumber"]').should('be.checked')
  })

  it('test the error message for special characters in tax number', () => {
    cy.on('uncaught:exception', (err) => {
      expect(err.message).to.include(en.errors.validation.taxNumber.specialCharacter)
      return false
    })

    cy.get('[data-cy=add-new-btn]').trigger('click')
    cy.get('[data-cy="showAddIndividualPersonManually"]').trigger('click')
    cy.get('[name="taxNumber"]').type('a').blur()
    cy.contains(en.errors.validation.taxNumber.specialCharacter).should('exist')
    cy.get('[type="radio"][value="hasTaxNumber"]').should('be.checked')
  })

  it('test the error message for invalid tax number', () => {
    cy.on('uncaught:exception', (err) => {
      expect(err.message).to.include(en.errors.validation.taxNumber.invalidNumber)
      return false
    })

    cy.get('[data-cy=add-new-btn]').trigger('click')
    cy.get('[data-cy="showAddIndividualPersonManually"]').trigger('click')
    cy.get('[name="taxNumber"]').type('111222333').blur()
    cy.contains(en.errors.validation.taxNumber.invalidNumber).should('exist')
    cy.get('[type="radio"][value="hasTaxNumber"]').should('be.checked')
  })
})
