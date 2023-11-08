describe('pages -> Add individual', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('verify CountriesOfCitizenship component is working', () => {
    cy.get('[data-cy="showAddIndividualPersonManually"]').trigger('click')

    const radioGroup = cy.get('[data-cy="countryOfCitizenshipRadioGroup"]').should('exist')

    const countryOfCitizenshipDropdown = cy.get('[data-cy="countryOfCitizenshipDropdown"]')
    countryOfCitizenshipDropdown.should('exist')

    const dropDwnButton = cy.get('[data-cy="countryOfCitizenshipDropdownButton"]').should('be.disabled')

    // select "other" value radio button
    radioGroup.children().find('[type="radio"]').check('other')

    // check button is not disabled anymore
    dropDwnButton.should('not.be.disabled')

    // check no dropdown options are open
    cy.get('[data-cy="countryOfCitizenshipDropdownOption"]').should('not.exist')

    // open dropdown
    dropDwnButton.get('[data-cy="countryOfCitizenshipDropdownButton"]').click()

    // check options are generating, 248 if not filtered
    countryOfCitizenshipDropdown.get('[data-cy="countryOfCitizenshipDropdownOption"]').should('have.length', 248)

    // select first item on the list ('Afghanistan')
    countryOfCitizenshipDropdown
      .get('[data-cy="countryOfCitizenshipDropdownOption"]')
      .first()
      .click({ force: true }) // needs force true because of parent element has overflow css

    // filter options
    cy.get('[data-cy="countryOfCitizenshipDropdownFilter"]').type('Croatia')
    countryOfCitizenshipDropdown
      .get('[data-cy="countryOfCitizenshipDropdownOption"]')
      .should('have.length', 1)

    // make sure a chip is displayed
    countryOfCitizenshipDropdown
      .get('[data-cy="countryOfCitizenshipDropdownChip"]')
      .should('have.length', 1)

    // select item on the list ('Croatia')
    countryOfCitizenshipDropdown
      .get('[data-cy="countryOfCitizenshipDropdownOption"]')
      .first()
      .click({ force: true }) // needs force true because of parent element has overflow css

    // make sure that it is still one element selected
    countryOfCitizenshipDropdown
      .get('[data-cy="countryOfCitizenshipDropdownOption"]')
      .should('have.length', 1)

    countryOfCitizenshipDropdown
      .get('[data-cy="countryOfCitizenshipDropdownOption"]')
      .children()
      .first()
      .should('have.text', ' Selected')

    // make sure two chips are displayed
    cy.get('[data-cy="countryOfCitizenshipDropdownChip"]').should('have.length', 2)
    cy.get('[data-cy="countryOfCitizenshipDropdownChip"]').last().should('have.text', 'Croatia')
  })
})
