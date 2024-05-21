import { dateToString } from '../../../../../btr-common-components/utils/date'

describe('pages -> Summary Table', () => {
  beforeEach(() => {
    cy.visitHomePageWithFakeData()
  })

  it('summary table headers are rendered', () => {
    const summaryTableHeaders = cy.get('[data-cy="individualsSummaryTable"]').get('th')
    summaryTableHeaders
      .should('contain', 'Name')
      .and('contain', 'Address')
      .and('contain', 'Details')
      .and('contain', 'Significance Dates')
      .and('contain', 'Control')
  })

  it('summary table body is rendered', () => {
    cy.addTestIndividuals()

    cy.fixture('individuals').then((testData) => {
      const today = new Date()
      const expectedDate = dateToString(today, 'YYYY-MM-DD')

      // check if the summary table contains` the correct data
      cy.get('[data-cy="individualsSummaryTable"]')
        .get('[data-cy=summary-table-name]').contains(testData.profile1.fullName.toUpperCase())
        .get('[data-cy=summary-table-name]').contains(testData.profile1.preferredName)
        .get('[data-cy=summary-table-name]').contains(testData.profile1.email)
        .get('[data-cy=summary-table-address]').contains(testData.profile1.address.streetAddress)
        .get('[data-cy=summary-table-address]').contains(testData.profile1.address.city)
        .get('[data-cy=summary-table-address]').contains(testData.profile1.address.province[1])
        .get('[data-cy=summary-table-address]').contains(testData.profile1.address.postalCode)
        .get('[data-cy=summary-table-address]').contains(testData.profile1.address.country)
        .get('[data-cy=summary-table-details]').contains(testData.profile1.taxNumber)
        .get('[data-cy=summary-table-details]').contains(testData.profile1.summaryTable.citizenship)
        .get('[data-cy=summary-table-details]').contains(testData.profile1.summaryTable.taxResidency)
        // todo: fixme: update on #TBD with new summary table
        // .get('[data-cy=summary-table-controls]').contains(testData.profile1.summaryTable.shareControl)
        // todo: fixme: update on #20756
        // .get('[data-cy=summary-table-controls]').contains(testData.profile1.summaryTable.directorControl)
        .get('[data-cy=summary-table-dates]').contains(expectedDate)
        .get('[data-cy=summary-table-name]').contains(testData.profile2.fullName.toUpperCase())
        .get('[data-cy=summary-table-name]').contains(testData.profile2.preferredName)
        .get('[data-cy=summary-table-name]').contains(testData.profile2.email)
        .get('[data-cy=summary-table-address]').contains(testData.profile2.address.streetAddress)
        .get('[data-cy=summary-table-address]').contains(testData.profile2.address.city)
        .get('[data-cy=summary-table-address]').contains(testData.profile2.address.province[1])
        .get('[data-cy=summary-table-address]').contains(testData.profile2.address.postalCode)
        .get('[data-cy=summary-table-address]').contains(testData.profile2.address.country)
        .get('[data-cy=summary-table-details]').contains(testData.profile2.taxNumber)
        .get('[data-cy=summary-table-details]').contains(testData.profile2.summaryTable.citizenship)
        .get('[data-cy=summary-table-details]').contains(testData.profile2.summaryTable.taxResidency)
      // todo: fixme: update on #TBD with new summary table
        // .get('[data-cy=summary-table-controls]').contains(testData.profile2.summaryTable.shareControl)
      // todo: fixme: update on #20756
        // .get('[data-cy=summary-table-controls]').contains(testData.profile2.summaryTable.directorControl)
    })
  })

  it('test the edit button', () => {
    // Edit buttons are rendered and enabled; edit form is not displayed
    cy.get('[data-cy=edit-button]').first().should('not.have.attr', 'disabled')
    cy.get('[data-cy=individualsSummaryTable]').should('not.contain', 'Edit an Individual')
    cy.get('[data-cy=summary-table-edit-form]').should('not.exist')

    // Click the first edit button to start editing the first significant individual profile
    cy.get('[data-cy=edit-button]').first().click()

    // After the button click, the edit form is displayed, the other edit button is disabled,
    // and the "Add an Individual" button is disabled
    cy.get('[data-cy=summary-table-edit-form]').should('exist')
    cy.get('[data-cy=edit-button]').first().should('have.attr', 'disabled')
    cy.get('[data-cy=individualsSummaryTable]').should('contain', 'Edit an Individual')
    cy.get('[data-cy=add-new-btn]').should('have.attr', 'disabled')
  })

  it('test two ways to remove citizenship in the edit form', () => {
    cy.addTestIndividuals()

    // open the edit form for the first SI and ensure it has one citizenship selected,
    // remove the citizenship by clicking on the selected item in the dropdown, and the SI should have no citizenship
    cy.get('[data-cy=edit-button]').eq(0).click()
    cy.get('[data-cy="countryOfCitizenshipDropdownChip"]').should('have.length', 1)
    cy.get('[data-cy="countryOfCitizenshipDropdownButton"]').click()
    cy.get('[data-cy="countryOfCitizenshipDropdownOption"]').first().click({ force: true })
    cy.get('[data-cy="countryOfCitizenshipDropdownChip"]').should('have.length', 0)

    cy.get('[data-cy=new-si-cancel-btn]').click()

    // open the edit form for the second SI and ensure it has one citizenship selected,
    // remove the citizenship by clicking on the selected citizenship tag, and the SI should have no citizenship
    cy.get('[data-cy=edit-button]').eq(1).click()
    cy.get('[data-cy="countryOfCitizenshipDropdownChip"]').should('have.length', 1)
    cy.get('[data-cy="countryOfCitizenshipDropdownChip"]').eq(0).get('[data-cy="close-icon"]').click()
    cy.get('[data-cy="countryOfCitizenshipDropdownChip"]').should('have.length', 0)
  })

  it('the edit form contains all information in the profile', () => {
    cy.fixture('individuals').then((testData) => {
      const today = new Date()
      const expectedDate = dateToString(today, 'YYYY-MM-DD')
      cy.addTestIndividuals()

      cy.get('[data-cy=edit-button]').first().click()

      cy.get('#individual-person-full-name').should('have.value', testData.profile1.fullName)
        .get('#individual-person-preferred-name').should('have.value', testData.profile1.preferredName)
        .get('#individual-person-email').should('have.value', testData.profile1.email)
        // todo: fixme update with #TBD
        // .get('input[name="percentOfShares[range]"]').invoke('val').should('eq', testData.profile1.percentOfShares)
        // .get('input[name="percentOfShares[range]"]').invoke('val').should('eq', testData.profile1.percentOfVotes)
        // todo: fixme update with #20756
        // .get('[data-cy="testTypeOfControl"]').get('[name="registeredOwner"]').should('be.checked')
        // .get('[data-cy="testControlOfDirectors"]').get('[name="directControl"]').should('be.checked')
        // todo: fix on #20760
        // .get('[data-cy=date-select]').should('have.value', expectedDate)
        .get('[data-cy="address-country"]').contains(testData.profile1.address.country)
        .get('[data-cy="address-line1-autocomplete"] input')
        .should('have.value', testData.profile1.address.streetAddress)
        .get('[data-cy="address-city"]').should('have.value', testData.profile1.address.city)
        .get('[data-cy="address-region-select"]').contains(testData.profile1.address.province[0])
        .get('[data-cy="address-postal-code"]').should('have.value', testData.profile1.address.postalCode)
        .get('[data-cy="countryOfCitizenshipDropdownButton"]').contains(testData.profile1.citizenships[0].name)
    })
  })

  it('test the CANCEL button in the Edit form', () => {
    cy.fixture('individuals').then((testData) => {
      cy.addTestIndividuals()

      cy.get('[data-cy=summary-table-name]').contains(testData.profile1.fullName.toUpperCase())

      cy.get('[data-cy=edit-button]').first().click()

      // When CANCEL button is clicked, the profile will not be changed
      cy.get('#individual-person-full-name').clear().type('NEW NAME')
      cy.get('[data-cy=new-si-cancel-btn]').click()
      cy.get('[data-cy=summary-table-name]').contains(testData.profile1.fullName.toUpperCase())
      cy.get('[data-cy=summary-table-name]').should('not.contain', 'NEW NAME')

      // the edit form will be closed
      cy.get('[data-cy=individualsSummaryTable]').should('not.contain', 'Edit an Individual')

      // the edit buttons will be enabled
      cy.get('[data-cy=edit-button]').eq(0).should('not.have.attr', 'disabled')
      cy.get('[data-cy=edit-button]').eq(1).should('not.have.attr', 'disabled')

      // the "Add an Individual" button will be enabled
      cy.get('[data-cy=add-new-btn]').should('not.have.attr', 'disabled')
    })
  })

  it('test the DONE button in the Edit form', () => {
    cy.addTestIndividuals()

    cy.get('[data-cy=summary-table-name]').first().invoke('text').then((textOrig) => {
      cy.get('[data-cy=edit-button]').first().click()

      const textEntered = 'NEW NAME'
      cy.get('#individual-person-full-name').clear().type(textEntered)
      cy.get('[data-cy=new-si-done-btn]').click()
      cy.get('[data-cy=summary-table-name]').first().invoke('text').should((textNew) => {
        expect(textNew).to.contain(textEntered)
        expect(textOrig).not.to.contain(textNew)
      })
    })

    cy.get('[data-cy=individualsSummaryTable]').should('not.contain', 'Edit an Individual')
    cy.get('[data-cy=edit-button]').eq(0).should('not.have.attr', 'disabled')
    cy.get('[data-cy=edit-button]').eq(1).should('not.have.attr', 'disabled')
    cy.get('[data-cy=add-new-btn]').should('not.have.attr', 'disabled')
  })

  it('test the REMOVE button in the Summary Table', () => {
    // remove all significant individuals from the table
    cy.get('[data-cy=popover-button]').then((buttons) => {
      for (let i = 0; i < buttons.length; i++) {
        cy.get('[data-cy=popover-button]').first().click()
        cy.get('[data-cy=remove-button]').click()
      }
    })

    cy.get('[data-cy="individualsSummaryTable"]').get('td')
      .should('contain.text', 'No significant individuals added yet')
  })

  it('test the REMOVE button in the Edit form', () => {
    // remove all significant individuals from the table
    cy.get('[data-cy=edit-button]').then((buttons) => {
      for (let i = 0; i < buttons.length; i++) {
        cy.get('[data-cy=edit-button]').first().click()
        cy.get('[data-cy=edit-si-remove-btn]').click()
      }
    })

    cy.get('[data-cy="individualsSummaryTable"]').get('td')
      .should('contain.text', 'No significant individuals added yet')
  })

  it('Editing should be disabled when the user is adding a new SI', () => {
    cy.get('[data-cy=add-new-btn]').click()
    cy.get('[data-cy=edit-button]').then((buttons) => {
      for (let i = 0; i < buttons.length; i++) {
        cy.get('[data-cy=edit-button]').first().should('have.attr', 'disabled')
      }
    })
    cy.get('[data-cy=new-si-cancel-btn]').click()
    cy.get('[data-cy=edit-button]').then((buttons) => {
      for (let i = 0; i < buttons.length; i++) {
        cy.get('[data-cy=edit-button]').first().should('not.have.attr', 'disabled')
      }
    })
  })
})
