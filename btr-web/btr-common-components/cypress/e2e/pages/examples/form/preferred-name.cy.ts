describe('forms -> preferred name -> validate that the preferred name component work inside example form', () => {
  let en: any

  beforeEach(() => {
    // load the English version of the language file
    cy.readFile('lang/en.json').then((json) => {
      en = json
    })

    // navigate to index page and check footer and header exist
    cy.visit('/examples/form')
  })

  it('test the validation rule for the maximum length of the preferred name', () => {
    cy.on('uncaught:exception', (err) => {
      expect(err.message).to.include(en.errors.validation.preferredName.maxLengthExceeded)
      return false
    })

    const invalidLongName = 'a'.repeat(151)
    const validLongName = '  ' + 'a'.repeat(150) + '  '

    cy.get('#testPreferredName').type(invalidLongName).blur()
    cy.contains(en.errors.validation.preferredName.maxLengthExceeded).should('exist')

    cy.get('#testPreferredName').clear().type(validLongName).blur()
    cy.contains(en.errors.validation.preferredName.maxLengthExceeded).should('not.exist')
  })

  it('preferred name can be empty', () => {
    cy.get('#testPreferredName').type('a').clear().blur()
  })

  it('test the validation rule for special character', () => {
    cy.on('uncaught:exception', (err) => {
      expect(err.message).to.include(en.errors.validation.preferredName.specialCharacter)
      return false
    })

    const invalidName = 'first - last'
    const validName = 'first last'
    const unicodeName1 = 'François'
    const unicodeName2 = 'José 玛丽'

    cy.get('#testPreferredName').type(invalidName).blur()
    cy.contains(en.errors.validation.preferredName.specialCharacter).should('exist')

    cy.get('#testPreferredName').clear().type(validName).blur()
    cy.contains(en.errors.validation.preferredName.specialCharacter).should('not.exist')

    cy.get('#testPreferredName').clear().type(unicodeName1).blur()
    cy.contains(en.errors.validation.preferredName.specialCharacter).should('not.exist')

    cy.get('#testPreferredName').clear().type(unicodeName2).blur()
    cy.contains(en.errors.validation.preferredName.specialCharacter).should('not.exist')
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
