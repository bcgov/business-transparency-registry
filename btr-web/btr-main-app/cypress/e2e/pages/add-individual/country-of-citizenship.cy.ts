describe('pages -> Add individual', () => {
  beforeEach(() => {
    cy.visitHomePageNoFakeData()
  })

  it('verify CountriesOfCitizenship component is working', () => {
    cy.get('[data-cy=add-new-btn]').trigger('click')
    // cy.get('[data-cy="showAddIndividualPersonManually"]').trigger('click')
    cy.get('[data-cy="citizenships.other.select"]').should('exist')
    cy.get('[data-cy="citizenships.otherComboboxButton"]').should('exist')

    // open dropdown
    cy.get('[data-cy="citizenships.otherComboboxButton"]').click()

    // check options are generating, 248 if not filtered (USA + 247 other countries)
    // Canadian and PR are now extracted as different options
    cy.get('[id^="headlessui-combobox-options"]').find('li').should('have.length', 248)

    // select first item on the list ('United States') and ensure a chip is displayed
    cy.get('[id^="headlessui-combobox-options"]').find('li').first().click({ force: true })
    cy.get('[data-cy="citizenships.otherComboboxChip"]')
      .should('have.length', 1)
      .should('have.text', 'United States')

    // filter options
    cy.get('[id^="headlessui-combobox-input"]').eq(1).type('Cro')
    cy.get('[id^="headlessui-combobox-options"]').find('li').should('have.length', 2)
    cy.get('[data-cy="citizenships.otherComboboxChip"]').should('have.length', 1)

    // select item on the list ('Croatia')
    cy.get('[id^="headlessui-combobox-options"]').find('li').first().click({ force: true })
    cy.get('[id^="headlessui-combobox-options"]').find('li').first().should('have.text', 'Croatia Selected')

    // make sure two chips are displayed (United States and Croatia)
    cy.get('[data-cy="citizenships.otherComboboxChip"]').should('have.length', 2)
    cy.get('[data-cy="citizenships.otherComboboxChip"]').last().should('have.text', 'Croatia')
  })

  it('test selections unselect and clear other options', () => {
    cy.get('[data-cy=add-new-btn]').trigger('click')
    cy.get('[data-cy="citizenships.otherComboboxButton"]').click()

    // Select citizen
    cy.get('input[data-cy="citizenships-ca-citizen-radio"]').check()
    cy.get('input[data-cy="citizenships-ca-pr-radio"]').should('not.be.checked')
    cy.get('input[data-cy="citizenships-other-radio"]').should('not.be.checked')

    // select PR
    cy.get('input[data-cy="citizenships-ca-pr-radio"]').check()
    cy.get('input[data-cy="citizenships-ca-citizen-radio"]').should('not.be.checked')
    cy.get('input[data-cy="citizenships-other-radio"]').should('not.be.checked')

    // select other
    cy.get('input[data-cy="citizenships-other-radio"]').check()
    cy.get('input[data-cy="citizenships-ca-pr-radio"]').should('not.be.checked')
    cy.get('input[data-cy="citizenships-ca-citizen-radio"]').should('not.be.checked')
  })
})
