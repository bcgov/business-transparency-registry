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
    cy.get('[data-cy="citizenships.select"]').should('exist')
    cy.get('[data-cy="citizenshipsComboboxButton"]').should('exist')

    // open dropdown
    cy.get('[data-cy="citizenshipsComboboxButton"]').click()

    // check options are generating, 250 if not filtered (Canadian Citizen + PR + USA + 247 other countries)
    cy.get('[id^="headlessui-combobox-options"]').find('li').should('have.length', 250)

    // select first item on the list ('Canada (Citizen)') and ensure a chip is displayed
    cy.get('[id^="headlessui-combobox-options"]').find('li').first().click({ force: true })
    cy.get('[data-cy="citizenshipsComboboxChip"]').should('have.length', 1)

    // filter options
    cy.get('[id^="headlessui-combobox-input"]').eq(1).type('Cro')
    cy.get('[id^="headlessui-combobox-options"]').find('li').should('have.length', 2)
    cy.get('[data-cy="citizenshipsComboboxChip"]').should('have.length', 1)

    // select item on the list ('Croatia')
    cy.get('[id^="headlessui-combobox-options"]').find('li').first().click({ force: true })
    cy.get('[id^="headlessui-combobox-options"]').find('li').first().should('have.text', 'Croatia Selected')

    // make sure two chips are displayed (Canada and Croatia)
    cy.get('[data-cy="citizenshipsComboboxChip"]').should('have.length', 2)
    cy.get('[data-cy="citizenshipsComboboxChip"]').last().should('have.text', 'Croatia')
  })

  it('test the validation rule for the citizenship dropdown', () => {
    cy.get('[data-cy=add-new-btn]').trigger('click')
    cy.get('[data-cy="citizenshipsComboboxButton"]').click()

    // When both Canadian citizen and PR are selected, an error is raised
    cy.get('[id^="headlessui-combobox-options"]').find('li').eq(0).click({ force: true })
    cy.get('[id^="headlessui-combobox-options"]').find('li').eq(1).click({ force: true })
    cy.contains(en.errors.validation.citizenship.prCitizen).should('exist')

    // unselect the PR option to remove the error
    cy.get('[id^="headlessui-combobox-options"]').find('li').eq(1).click({ force: true })
    cy.contains(en.errors.validation.citizenship.prCitizen).should('not.exist')

    // clear the selection
    cy.get('[id^="headlessui-combobox-options"]').find('li').eq(0).click({ force: true })
    cy.contains(en.errors.validation.citizenship.required).should('exist')
  })
})
