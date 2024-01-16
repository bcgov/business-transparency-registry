import { dateToString } from '../../../../../btr-common-components/utils/date'
import payFeesForBtrRegsigin from '../../../fixtures/payFeeForBtrRegsigin.json'

describe('pages -> Beneficial Owner Change', () => {
  beforeEach(() => {
    cy.visit('/')
    // Select the effective date
    cy.get('[data-cy=date-select]').click()
    cy.wait(250)
    cy.get('.bcros-date-picker__calendar__day.dp__today').parent().click()
    cy.fixture('individuals').then((testData) => {
      cy.intercept(
        'GET',
        'https://pay-api-dev.apps.silver.devops.gov.bc.ca/api/v1/fees/BTR/REGSIGIN',
        { data: payFeesForBtrRegsigin })

      // Add the first individual
      cy.get('[data-cy=add-new-btn]').click()
      cy.get('#individual-person-full-name').type(testData.profile1.fullName)
      cy.get('#individual-person-preferred-name').type(testData.profile1.preferredName)
      cy.get('#individual-person-email').type(testData.profile1.email)
      cy.get('[name="percentOfShares"]').type(testData.profile1.percentOfShares)
      cy.get('[name="percentOfVotes"]').type(testData.profile1.percentOfVotes)
      cy.get('[data-cy="testTypeOfControl"]').get('[name="registeredOwner"]').check()
      cy.get('[data-cy="testControlOfDirectors"]').get('[name="directControl"]').check()
      cy.get('#addNewPersonBirthdate').trigger('click')
      cy.get('[data-cy=date-picker]').get('.bcros-date-picker__calendar__day.dp__today').trigger('click')
      cy.get('[data-cy="address-country"]').click()
      cy.get('[data-cy="address-country"]').get('li').contains(testData.profile1.address.country).click()
      cy.get('[data-cy="address-line1-autocomplete"]').type(testData.profile1.address.streetAddress)
      cy.get('[data-cy="address-city"]').type(testData.profile1.address.city)
      cy.get('[data-cy="address-region-select"]').click()
      cy.get('[data-cy="address-region-select"]').get('li').contains(testData.profile1.address.province[0]).click()
      cy.get('[data-cy="address-postal-code"]').type(testData.profile1.address.postalCode)
      cy.get('[data-cy="countryOfCitizenshipRadioGroup"]').get('[type="radio"][value="citizen"]').check()
      cy.get('[name="taxNumber"]').type(testData.profile1.taxNumber)
      cy.get('[data-cy="testTaxResidency"]').get('[type="radio"][value="true"]').check()
      cy.get('[data-cy=new-si-done-btn]').click()

      // Add the second individual
      cy.get('[data-cy=add-new-btn]').click()
      cy.get('#individual-person-full-name').type(testData.profile2.fullName)
      cy.get('#individual-person-preferred-name').type(testData.profile2.preferredName)
      cy.get('#individual-person-email').type(testData.profile2.email)
      cy.get('[name="percentOfShares"]').type(testData.profile2.percentOfShares)
      cy.get('[name="percentOfVotes"]').type(testData.profile2.percentOfVotes)
      cy.get('[data-cy="testTypeOfControl"]').get('[name="registeredOwner"]').check()
      cy.get('[data-cy="testControlOfDirectors"]').get('[name="directControl"]').check()
      cy.get('#addNewPersonBirthdate').trigger('click')
      cy.get('[data-cy=date-picker]').get('.bcros-date-picker__calendar__day.dp__today').trigger('click')
      cy.get('[data-cy="address-country"]').click()
      cy.get('[data-cy="address-country"]').get('li').contains(testData.profile2.address.country).click()
      cy.get('[data-cy="address-line1-autocomplete"]').type(testData.profile2.address.streetAddress)
      cy.get('[data-cy="address-city"]').type(testData.profile2.address.city)
      cy.get('[data-cy="address-region-select"]').click()
      cy.get('[data-cy="address-region-select"]').get('li').contains(testData.profile2.address.province[0]).click()
      cy.get('[data-cy="address-postal-code"]').type(testData.profile2.address.postalCode)
      cy.get('[data-cy="countryOfCitizenshipRadioGroup"]').get('[type="radio"][value="citizen"]').check()
      cy.get('[name="taxNumber"]').type(testData.profile2.taxNumber)
      cy.get('[data-cy="testTaxResidency"]').get('[type="radio"][value="true"]').check()
      cy.get('[data-cy=new-si-done-btn]').click()
    })
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
        .get('[data-cy=summary-table-controls]').contains(testData.profile1.summaryTable.shareControl)
        .get('[data-cy=summary-table-controls]').contains(testData.profile1.summaryTable.directorControl)
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
        .get('[data-cy=summary-table-controls]').contains(testData.profile2.summaryTable.shareControl)
        .get('[data-cy=summary-table-controls]').contains(testData.profile2.summaryTable.directorControl)
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

  it('the edit form contains all information in the profile', () => {
    cy.fixture('individuals').then((testData) => {
      const today = new Date()
      const expectedDate = dateToString(today, 'YYYY-MM-DD')

      cy.get('[data-cy=edit-button]').first().click()

      cy.get('#individual-person-full-name').should('have.value', testData.profile1.fullName)
        .get('#individual-person-preferred-name').should('have.value', testData.profile1.preferredName)
        .get('#individual-person-email').should('have.value', testData.profile1.email)
        .get('[name="percentOfShares"]').should('have.value', testData.profile1.percentOfShares)
        .get('[name="percentOfVotes"]').should('have.value', testData.profile1.percentOfVotes)
        .get('[data-cy="testTypeOfControl"]').get('[name="registeredOwner"]').should('be.checked')
        .get('[data-cy="testControlOfDirectors"]').get('[name="directControl"]').should('be.checked')
        .get('[data-cy=date-select]').should('have.value', expectedDate)
        .get('[data-cy="address-country"]').contains(testData.profile1.address.country)
        .get('[data-cy="address-line1-autocomplete"] input')
        .should('have.value', testData.profile1.address.streetAddress)
        .get('[data-cy="address-city"]').should('have.value', testData.profile1.address.city)
        .get('[data-cy="address-region-select"]').contains(testData.profile1.address.province[1])
        .get('[data-cy="address-postal-code"]').should('have.value', testData.profile1.address.postalCode)
        .get('[data-cy="countryOfCitizenshipRadioGroup"]').get('[type="radio"][value="citizen"]').should('be.checked')
        .get('[name="taxNumber"]').should('have.value', testData.profile1.taxNumber)
        .get('[data-cy="testTaxResidency"]').get('[type="radio"][value="true"]').should('be.checked')
    })
  })

  it('test the CANCEL button in the Edit form', () => {
    cy.fixture('individuals').then((testData) => {
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
    cy.get('[data-cy=popover-button]').then((buttons) => {
      for (let i = 0; i < buttons.length; i++) {
        cy.get('[data-cy=edit-button]').first().click()
        cy.get('[data-cy=edit-si-remove-btn]').click()
      }
    })

    cy.get('[data-cy="individualsSummaryTable"]').get('td')
      .should('contain.text', 'No significant individuals added yet')
  })
})
