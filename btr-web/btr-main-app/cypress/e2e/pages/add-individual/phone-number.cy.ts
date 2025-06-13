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
    // Case 1: phone country code is prepopulated when selecting country address
    cy.get('[data-cy="address-country"]')
      .click()
      .get('span.truncate')
      .contains('Canada')
      .click()
      .get('[data-cy="phoneNumber.countryCode"]')
      .should('have.value', '+1')

    // Case 2: changing the country in the address section should change the country calling code as well
    cy.get('[data-cy="address-country"]')
      .click()
      .get('span.truncate')
      .contains('New Zealand')
      .click()
      .get('[data-cy="phoneNumber.countryCode"]')
      .should('have.value', '+64')

    cy.get('[data-cy="phoneNumber.countryCode"]')
      .clear({ force: true })
      .type('{esc}')
      .blur()

    // Case 3: select a country from the dropdown
    cy.get('[data-cy="expandCountryCodeDropdown"]')
      .click()
      .get('[data-cy="countryCodeOption"]')
      .should('exist')
      .get('[data-cy="countryCodeOption"]').eq(0) // select Canada
      .click()
      .get('[data-cy="phoneNumber.countryCode"]')
      .should('have.value', '+1')
      .get('[data-cy="phoneNumberInput"]')
      .find('input+span .flag.f-ca')
      .should('exist')
      .get('[data-cy="expandCountryCodeDropdown"]')
      .click()
      .get('[data-cy="countryCodeOption"]').eq(3) // select the US
      .click()
      .get('[data-cy="phoneNumberInput"]')
      .find('input+span .flag.f-us')
      .should('exist')

    // Case 4: unselect a country by clicking on the option again
    cy.get('[data-cy="expandCountryCodeDropdown"]')
      .click()
      .get('[data-cy="countryCodeOption"]').eq(3)
      .click()
      .get('[data-cy="phoneNumber.countryCode"]')
      .should('have.value', '')
      .get('[data-cy="phoneNumberInput"]')
      .find('input+span .flag.f-us')
      .should('not.exist')

    // Case 5: delete the country by clicking the delete button
    cy.get('[data-cy="expandCountryCodeDropdown"]')
      .click()
      .get('[data-cy="countryCodeOption"]').eq(0) // select Canada
      .click()
      .get('[data-cy="clearCountryCode"]') // click the 'X' button
      .click()
      .get('[data-cy="phoneNumberInput"]')
      .find('input+span .flag.f-ca')
      .should('not.exist')

    // Case 6: free typing to narrow down the options
    cy.get('[data-cy="phoneNumber.countryCode"]')
      .type('88')
      .get('[data-cy="countryCodeOption"]')
      .should('have.length', 3)
      .get('[data-cy="phoneNumber.countryCode"]')
      .type('0')
      .get('[data-cy="countryCodeOption"]')
      .should('have.length', 1)
  })
})
