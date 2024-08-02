describe('pages -> Add individual', () => {
  beforeEach(() => {
    cy.visitHomePageWithFakeData()
    cy.get('[data-cy=add-new-btn]').trigger('click')
  })

  it('verify Phone Number component is displayed', () => {
    cy.get('[data-cy="phoneNumberInput"]').should('exist')

    cy.get('[data-cy="phoneNumber.countryCode"]').should('exist')
    cy.get('[data-cy="phoneNumber.number"]').should('exist')
    cy.get('[data-cy="phoneNumber.extensionCode"]').should('exist')
  })

  it('verify country code combobox behaviour', () => {
    // verify phone country code is prepopulated when selecting country address
    cy.get('[data-cy="address-country"]')
      .click()

    cy.get('span.truncate')
      .contains('Canada')
      .click()

    // clear input
    cy.get('[data-cy="phoneNumber.countryCode"]')
      .clear()
      .type('{esc}')
      .blur()

    // verify you can enter any data in the combo box
    cy.get('[data-cy="phoneNumber.countryCode"]')
      .type('23a')
      .type('{esc}')
      .blur()

    cy.get('[data-cy="phoneNumber.countryCode"]')
      .should('have.value', '23a')

    cy.get('[data-cy="phoneNumberInput"]')
      .find('ul .flag.f-ca')
      .should('not.exist')

    // clear input
    cy.get('[data-cy="phoneNumber.countryCode"]')
      .clear()
      .type('{esc}')
      .blur()

    // verify you can select canada flag from the dropdown
    cy.get('[data-cy="phoneNumberInput"]')
      .find('button')
      .click()

    cy.get('ul .flag.f-ca')
      .click()

    cy.get('[data-cy="phoneNumberInput"]')
      .find('input+span .flag.f-ca')
      .should('exist')

    cy.get('[data-cy="phoneNumber.countryCode"]')
      .should('have.value', '+1')
  })

  it('verify phone number input mask ', () => {
    // no selection, verify it has no input mask
    cy.get('[data-cy="phoneNumber.number"]')
      .type('1234567890')

    cy.get('[data-cy="phoneNumber.number"]')
      .should('have.value', '1234567890')

    // select country code canada // it will change to input mask (###) ###-####
    cy.get('[data-cy="phoneNumberInput"]')
      .find('button')
      .click()

    cy.get('ul .flag.f-ca')
      .click()

    cy.get('[data-cy="phoneNumberInput"]')
      .find('input+span .flag.f-ca')
      .should('exist')

    cy.get('[data-cy="phoneNumber.countryCode"]')
      .should('have.value', '+1')

    cy.get('[data-cy="phoneNumber.number"]')
      .should('have.value', '(123) 456-7890')
  })
})
