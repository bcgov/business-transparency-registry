describe('pages -> Review and Confirm', () => {
  let en: any

  beforeEach(() => {
    cy.readFile('lang/en.json').then((json) => {
      en = json
    })

    cy.visit('/BC0871427/beneficial-owner-change/review-confirm')
  })

  it('verify significantIndividualChangeFolioNumber is rendered as expected', () => {
    cy.get('[data-cy="significantIndividualChangeFolioNumberLabel"]').should('have.text', 'Folio or Reference Number')
    cy.get('[data-cy="significantIndividualChangeFolioNumberTextArea"]').type('123123')
    cy.get('[data-cy="significantIndividualChangeFolioNumberTextArea"]').should('have.value', '123123')
  })

  it('verify significantIndividualChangeFolioNumber error text to big', () => {
    let toBigText = ''
    for (let i = 0; i < 31; i++) {
      toBigText += '' + i
    }

    cy.get('[data-cy="significantIndividualChangeFolioNumber"]')
      .should('not.contain.text', en.errors.validation.folioNumber.maxLengthExceeded)
    cy.get('[data-cy="significantIndividualChangeFolioNumberLabel"]')
      .should('have.text', 'Folio or Reference Number')
    cy.get('[data-cy="significantIndividualChangeFolioNumberTextArea"]').type(toBigText).blur()
    cy.get('[data-cy="significantIndividualChangeFolioNumberTextArea"]').should('have.value', toBigText)
    cy.get('[data-cy="significantIndividualChangeFolioNumber"]')
      .should('contain.text', en.errors.validation.folioNumber.maxLengthExceeded)
  })

  it('verify significantIndividualChangeFolioNumber error special characters', () => {
    const wonkyText = 'a...'
    cy.get('[data-cy="significantIndividualChangeFolioNumber"]')
      .should('not.contain.text', en.errors.validation.folioNumber.maxLengthExceeded)
    cy.get('[data-cy="significantIndividualChangeFolioNumberLabel"]').should('have.text', 'Folio or Reference Number')
    cy.get('[data-cy="significantIndividualChangeFolioNumberTextArea"]').type(wonkyText).blur()
    cy.get('[data-cy="significantIndividualChangeFolioNumberTextArea"]')
      .should('have.value', wonkyText)
    cy.get('[data-cy="significantIndividualChangeFolioNumber"]')
      .should('contain.text', en.errors.validation.folioNumber.specialCharacter)
  })
})
