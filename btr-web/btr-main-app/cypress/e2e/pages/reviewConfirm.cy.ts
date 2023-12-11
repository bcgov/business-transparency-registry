import { dateToString } from '../../../../btr-common-components/utils/date'
import payFeesForBtrRegsigin from '../../fixtures/payFeeForBtrRegsigin.json'

describe('pages -> Review and Confirm', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.wait(1000)
  })

  it('verify pay fee widget is visible and base state is available', () => {
    cy.visit('/BC0871427/beneficial-owner-change/review-confirm')
    cy.wait(1000)
    cy.viewport(2560, 1440)
    cy.intercept(
      'GET',
      'https://pay-api-dev.apps.silver.devops.gov.bc.ca/api/v1/fees/BTR/REGSIGIN',
      { data: payFeesForBtrRegsigin })

    // check base state exists and contains - for no items
    cy.get('[data-cy="pay-fees-widget-empty-fees"]').contains('-')

    // check totals line footer exists and has - denoting no items are present
    cy.get('[data-cy="pay-fees-widget-total"]').contains('-')
  })

  it('integration test for adding an individual and reviewing the summary', () => {
    cy.fixture('individual').then((testData) => {
      cy.intercept(
        'GET',
        'https://pay-api-dev.apps.silver.devops.gov.bc.ca/api/v1/fees/BTR/REGSIGIN',
        { data: payFeesForBtrRegsigin })

      // select the date of today
      cy.get('[data-cy=date-select]').trigger('click')
      cy.get('[data-cy=date-picker]').get('.bcros-date-picker__calendar__day.dp__today').trigger('click')

      // click 'Add an Individual' button and expand the form
      cy.get('[data-cy=add-new-btn]').trigger('click')
      cy.get('[data-cy=showAddIndividualPersonManually]').trigger('click')

      // fill out the form
      cy.get('#individual-person-full-name').type(testData.fullName)
      cy.get('#individual-person-preferred-name').type(testData.preferredName)
      cy.get('#individual-person-email').type(testData.email)

      // enter shares percent
      cy.get('[name="percentOfShares"]').type(testData.percentOfShares)
      cy.get('[name="percentOfVotes"]').type(testData.percentOfVotes)

      // select the control type (registred owner + direct control)
      cy.get('[data-cy="testTypeOfControl"]').get('[name="registeredOwner"]').check()
      cy.get('[data-cy="testControlOfDirectors"]').get('[name="directControl"]').check()

      // select the birthdate (here we just use today's date for simplicity)
      cy.get('#addNewPersonBirthdate').trigger('click')
      cy.get('[data-cy=date-picker]').get('.bcros-date-picker__calendar__day.dp__today').trigger('click')

      // enter the address
      cy.get('[data-cy="address-country"]').click()
      cy.get('[data-cy="address-country"]').get('li').contains(testData.address.country).click()
      cy.get('[data-cy="address-line1-autocomplete"]').type(testData.address.streetAddress)
      cy.get('[data-cy="address-city"]').type(testData.address.city)
      cy.get('[data-cy="address-region-select"]').click()
      cy.get('[data-cy="address-region-select"]').get('li').contains(testData.address.province[0]).click()
      cy.get('[data-cy="address-postal-code"]').type(testData.address.postalCode)

      // select the citizenship info
      cy.get('[data-cy="countryOfCitizenshipRadioGroup"]').get('[type="radio"][value="citizen"]').check()

      // enter tax number and select tax residency
      cy.get('[name="taxNumber"]').type(testData.taxNumber)
      cy.get('[data-cy="testTaxResidency"]').get('[type="radio"][value="true"]').check()

      // click 'Done' button to add the individual
      cy.get('[data-cy=new-si-done-btn]').click()

      // click 'Review and Confirm' button to review the summary'
      cy.get('[data-cy="button-control-right-button"]').click()

      // verify the url changes to /review-confirm
      cy.url().should('include', '/review-confirm')

      // check the significant individual change date is correct
      const today = new Date()
      const expectedDate = dateToString(today, 'YYYY-MM-DD')
      cy.get('[data-cy=effective-date-select]').contains(expectedDate)

      // check if the summary table contain the correct data
      const summaryTable = cy.get('[data-cy="individualsSummaryTable"]')
      summaryTable.get('[data-cy=summary-table-name]').contains(testData.fullName.toUpperCase())
      summaryTable.get('[data-cy=summary-table-name]').contains(testData.preferredName)
      summaryTable.get('[data-cy=summary-table-name]').contains(testData.email)
      summaryTable.get('[data-cy=summary-table-address]').contains(testData.address.streetAddress)
      summaryTable.get('[data-cy=summary-table-address]').contains(testData.address.city)
      summaryTable.get('[data-cy=summary-table-address]').contains(testData.address.province[1])
      summaryTable.get('[data-cy=summary-table-address]').contains(testData.address.postalCode)
      summaryTable.get('[data-cy=summary-table-address]').contains(testData.address.country)
      summaryTable.get('[data-cy=summary-table-details]').contains(testData.taxNumber)
      summaryTable.get('[data-cy=summary-table-details]').contains(testData.summaryTable.citizenship)
      summaryTable.get('[data-cy=summary-table-details]').contains(testData.summaryTable.taxResidency)

      summaryTable.get('[data-cy=summary-table-dates]').contains(expectedDate)

      summaryTable.get('[data-cy=summary-table-controls]').contains(testData.summaryTable.shareControl)
      summaryTable.get('[data-cy=summary-table-controls]').contains(testData.summaryTable.directorControl)
    })
  })

  it('verify the certify section is rendered and the checkbox is working', () => {
    cy.visit('/BC0871427/beneficial-owner-change/review-confirm')
    cy.get('[data-cy="certify-section"]').should('exist')
    cy.get('[data-cy="certify-section-label"]').should('exist')
    cy.get('[data-cy="certify-section-checkbox"]').should('exist')
    cy.get('[data-cy="certify-section-checkbox"]').check().should('be.checked')
  })
})
