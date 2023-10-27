describe('forms -> preferred name -> validate that the preferred name component work inside example form', () => {
  beforeEach(() => {
    // navigate to index page and check footer and header exist
    cy.visit('/examples/form')
  })

  it('test the validation rule for the maximum length of the preferred name', () => {
    cy.on('uncaught:exception', (err) => {
      expect(err.message).to.include('The preferred name must not exceed 150 characters')
      return false
    })

    const invalidLongName = 'a'.repeat(151)
    const validLongName = '  ' + 'a'.repeat(150) + '  '

    cy.get('#testPreferredName').type(invalidLongName).blur()
    cy.contains('The preferred name must not exceed 150 characters').should('exist')

    cy.get('#testPreferredName').clear().type(validLongName).blur()
    cy.contains('The preferred name must not exceed 150 characters').should('not.exist')
  })

  it('preferred name can be empty', () => {
    cy.on('uncaught:exception', (err) => {
      expect(err.message).to.include('The preferred name should contain at least one character')
      return false
    })

    cy.get('#testPreferredName').clear().blur()
    cy.contains('The preferred name should contain at least one character').should('not.exist')
  })

  it('test the validation rule for special character', () => {
    cy.on('uncaught:exception', (err) => {
      expect(err.message).to.include('The preferred name should not contain special character')
      return false
    })

    const invalidName = 'first - last'
    const validName = 'first last'
    const unicodeName1 = 'François'
    const unicodeName2 = 'José 玛丽'

    cy.get('#testPreferredName').type(invalidName).blur()
    cy.contains('The preferred name should not contain special character').should('exist')

    cy.get('#testPreferredName').clear().type(validName).blur()
    cy.contains('The preferred name should not contain special character').should('not.exist')

    cy.get('#testPreferredName').clear().type(unicodeName1).blur()
    cy.contains('The preferred name should not contain special character').should('not.exist')

    cy.get('#testPreferredName').clear().type(unicodeName2).blur()
    cy.contains('The preferred name should not contain special character').should('not.exist')
  })

  it('the displayed name should be normalized', () => {
    const name = '    First name   M    Last   name    '
    const normailizeName = 'First name M Last name'
    cy.get('#testPreferredName').type(name)
    cy.get('#testPreferredName').invoke('val').should('eq', name)
    cy.get('#testPreferredName').blur()
    cy.get('#testPreferredName').invoke('val').should('eq', normailizeName)
  })
})
