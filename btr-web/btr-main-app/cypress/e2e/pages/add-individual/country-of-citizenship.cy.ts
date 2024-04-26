describe('pages -> Add individual', () => {
  let en: any

  beforeEach(() => {
    cy.readFile('lang/en.json').then((json) => {
      en = json
    })

    cy.visit('/')
  })

  it('verify CountriesOfCitizenship component is working', () => {
    cy.get('[data-cy=add-new-btn]').trigger('click')
    // cy.get('[data-cy="showAddIndividualPersonManually"]').trigger('click')

    const countryOfCitizenshipDropdown = cy.get('[data-cy="countryOfCitizenshipDropdown"]')
    const dropDwnButton = cy.get('[data-cy="countryOfCitizenshipDropdownButton"]')
    dropDwnButton.should('exist')
    countryOfCitizenshipDropdown.should('exist')

    // open dropdown
    dropDwnButton.get('[data-cy="countryOfCitizenshipDropdownButton"]').click()

    // check options are generating, 250 if not filtered (Canadian Citizen + PR + USA + 247 other countries)
    countryOfCitizenshipDropdown.get('[data-cy="countryOfCitizenshipDropdownOption"]').should('have.length', 250)

    // select first item on the list ('Canada (Citizen)')
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

  it('test the validation rule for the citizenship dropdown', () => {
    cy.get('[data-cy=add-new-btn]').trigger('click')
    cy.get('[data-cy="countryOfCitizenshipDropdownButton"]').click()

    // When both Canadian citizen and PR are selected, an error is raised
    cy.get('[data-cy="countryOfCitizenshipDropdownOption"]').eq(0).click({ force: true })
    cy.get('[data-cy="countryOfCitizenshipDropdownOption"]').eq(1).click({ force: true })
    cy.contains(en.errors.validation.citizenship.prCitizen).should('exist')

    // unselect the PR option to remove the error
    cy.get('[data-cy="countryOfCitizenshipDropdownOption"]').eq(1).click({ force: true })
    cy.contains(en.errors.validation.citizenship.prCitizen).should('not.exist')

    // clear the selection
    cy.get('[data-cy="countryOfCitizenshipDropdownOption"]').eq(0).click({ force: true })
    cy.contains(en.errors.validation.citizenship.required).should('exist')
  })
})
