describe('forms -> preferred name -> validate that the preferred name component work inside example form', () => {
  beforeEach(() => {
    // navigate to index page and check footer and header exist
    cy.visit('/examples/form')
  })

  it('test the validation rule for the maximum name length', () => {
    cy.on('uncaught:exception', (err) => {
      expect(err.message).to.include('The legal name must not exceed 150 characters')
      return false
    })

    const invalidLongName = 'a'.repeat(151)
    const validLongName = '  ' + 'a'.repeat(150) + '  '

    cy.get('#testFullName').type(invalidLongName).blur()
    cy.contains('The legal name must not exceed 150 characters').should('exist')

    cy.get('#testFullName').clear().type(validLongName).blur()
    cy.contains('The legal name must not exceed 150 characters').should('not.exist')
  })

  it('test the validation rule for the minimum name length', () => {
    cy.on('uncaught:exception', (err) => {
      expect(err.message).to.include('The legal name should contain at least one character')
      return false
    })

    const singleCharacter = 'a'
    cy.get('#testFullName').type(singleCharacter).blur()
    cy.contains('The legal name should contain at least one character').should('not.exist')

    cy.get('#testFullName').clear().blur()
    cy.contains('The legal name should contain at least one character').should('exist')
  })

  it('test the validation rule for special character', () => {
    cy.on('uncaught:exception', (err) => {
      expect(err.message).to.include('The legal name should not contain special character')
      return false
    })

    const invalidName = 'first - last'
    const validName = 'first last'


    cy.get('#testFullName').type(invalidName).blur()
    cy.contains('The legal name should not contain special character').should('exist')

    cy.get('#testFullName').clear().type(validName).blur()
    cy.contains('The legal name should not contain special character').should('not.exist')
  })

  it('the full name field should accept UTF-8 characters', () => {
    cy.contains('Full Legal Name:')
    const email = 'abc@email.com'
    cy.get('#testEmail').type(email)

    const name1 = 'François'
    const name2 = 'José 玛丽'

    cy.get('#testFullName').type(name1)
    cy.get('#exampleSubmitButton').click()
    cy.get('#testFullName').clear().type(name2).blur()
    cy.get('#exampleSubmitButton').click()
  })

  it('the displayed name should be normalized', () => {
    const name = '    First name   M    Last   name    '
    const normailizeName = 'First name M Last name'
    cy.get('#testFullName').type(name)
    cy.get('#testFullName').invoke('val').should('eq', name)
    cy.get('#testFullName').blur()
    cy.get('#testFullName').invoke('val').should('eq', normailizeName)
  })
})
