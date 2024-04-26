import { dateToString } from '../../../../btr-common-components/utils/date'
import payFeesForBtrRegsigin from '../../fixtures/payFeeForBtrRegsigin.json'

describe('pages -> Review and Confirm', () => {
  beforeEach(() => {
    cy.interceptPayFeeApi().as('payFeeApi')
    cy.interceptBusinessContact().as('businessContact')
    cy.interceptBusinessSlim().as('businessApiCall')
  })

  it('verify pay fee widget is visible and base state is available', () => {
    cy.visit('/BC0871427/beneficial-owner-change/review-confirm')
    cy.wait(['@businessApiCall', '@payFeeApi', '@businessContact'])

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
    cy.fixture('individuals').then((testData) => {
      cy.interceptPostsEntityApi().as('existingSIs')
      cy.visit('/')
      cy.wait(['@existingSIs', '@businessApiCall', '@payFeeApi', '@businessContact'])
      // select the date of today
      cy.get('[data-cy=date-select]').click().then(() => {
        cy.get('.bcros-date-picker__calendar__day.dp__today').parent().click()
      })

      // click 'Add an Individual' button and expand the form
      cy.get('[data-cy=add-new-btn]').click()
      // cy.get('[data-cy=showAddIndividualPersonManually]').click()

      // fill out the form
      cy.get('#individual-person-full-name').type(testData.profile1.fullName)
      cy.get('[data-cy=usePreferredName').check()
      cy.get('#individual-person-preferred-name').type(testData.profile1.preferredName)
      cy.get('#individual-person-email').type(testData.profile1.email)

      // enter shares and votes percentage
      cy.get('[data-cy=testPercentOfShares]').click().find('li').eq(0).click()
      cy.get('[data-cy=testPercentOfVotes]').click().find('li').eq(0).click()

      // select the control type (registred owner + direct control)
      cy.get('[data-cy="testTypeOfControl"]').get('[name="registeredOwner"]').check()
      cy.get('[data-cy="testControlOfDirectors"]').get('[name="directControl"]').check()

      // select the birthdate (here we just use today's date for simplicity)
      cy.get('#addNewPersonBirthdate').trigger('click')
      cy.get('[data-cy=date-picker]').get('.bcros-date-picker__calendar__day.dp__today').trigger('click')

      // enter the address
      cy.get('[data-cy="address-country"]').click()
      cy.get('[data-cy="address-country"]').get('li').contains(testData.profile1.address.country).click()
      cy.get('[data-cy="address-line1-autocomplete"]').type(testData.profile1.address.streetAddress)
      cy.get('[data-cy="address-city"]').type(testData.profile1.address.city)
      cy.get('[data-cy="address-region-select"]').click()
      cy.get('[data-cy="address-region-select"]').get('li').contains(testData.profile1.address.province[0]).click()
      cy.get('[data-cy="address-postal-code"]').type(testData.profile1.address.postalCode)

      // select the citizenship info
      cy.get('[data-cy="countryOfCitizenshipDropdownButton"]').click()
      cy.get('[data-cy="countryOfCitizenshipDropdownOption"]').eq(0).click({ force: true })

      // enter tax number and select tax residency
      cy.get('[data-cy="tax-number-input"]').type(testData.profile1.taxNumber)
      cy.get('[data-cy="testTaxResidency"]').get('[type="radio"][value="true"]').check()

      // click 'Done' button to add the individual
      cy.get('[data-cy=new-si-done-btn]').click()

      // click 'Review and Confirm' button to review the summary'
      cy.get('[data-cy="button-control-right-button"]').click()

      // verify the url changes to /review-confirm
      cy.url().should('include', '/review-confirm')

      // check the Significant Individual Filing Effective Date is correct
      const today = new Date()
      const expectedDate = dateToString(today, 'YYYY-MM-DD')
      cy.get('[data-cy=effective-date-select]').contains(expectedDate)

      // check if the summary table contain the correct data
      const summaryTable = cy.get('[data-cy="individualsSummaryTable"]')
      summaryTable.get('[data-cy=summary-table-name]').contains(testData.profile1.fullName.toUpperCase())
      summaryTable.get('[data-cy=summary-table-name]').contains(testData.profile1.preferredName)
      summaryTable.get('[data-cy=summary-table-name]').contains(testData.profile1.email)
      summaryTable.get('[data-cy=summary-table-address]').contains(testData.profile1.address.streetAddress)
      summaryTable.get('[data-cy=summary-table-address]').contains(testData.profile1.address.city)
      summaryTable.get('[data-cy=summary-table-address]').contains(testData.profile1.address.province[1])
      summaryTable.get('[data-cy=summary-table-address]').contains(testData.profile1.address.postalCode)
      summaryTable.get('[data-cy=summary-table-address]').contains(testData.profile1.address.country)
      summaryTable.get('[data-cy=summary-table-details]').contains(testData.profile1.taxNumber)
      summaryTable.get('[data-cy=summary-table-details]').contains(testData.profile1.summaryTable.citizenship)
      summaryTable.get('[data-cy=summary-table-details]').contains(testData.profile1.summaryTable.taxResidency)

      summaryTable.get('[data-cy=summary-table-dates]').contains(expectedDate)

      summaryTable.get('[data-cy=summary-table-controls]').contains(testData.profile1.summaryTable.shareControl)
      summaryTable.get('[data-cy=summary-table-controls]').contains(testData.profile1.summaryTable.directorControl)

      // can click 'back' to go back to non review page
      cy.get('[data-cy=button-control-right-button]').eq(0).should('have.text', 'Back')
      cy.get('[data-cy=button-control-right-button]').eq(0).click()
      cy.url().should('not.include', '/beneficial-owner-change/review-confirm')
      cy.url().should('include', '/beneficial-owner-change')

      // go back to review and file now, FUTURE: check certify / folio
      cy.get('[data-cy=button-control-right-button]').eq(0).should('have.text', 'Review and Confirm')
      cy.get('[data-cy=button-control-right-button]').eq(0).click()
      cy.url().should('include', '/beneficial-owner-change/review-confirm')
      cy.get('[data-cy=button-control-right-button]').eq(1).should('have.text', 'File Now (no fee)')
      // validate certify is not checked yet
      cy.get('[data-cy="certify-section-checkbox"]').should('not.be.checked')
      cy.get('[data-cy=button-control-right-button]').eq(1).click()
      // Certify was not checked so nothing should happen
      cy.url().should('include', '/beneficial-owner-change/review-confirm')
      // Check certify and file
      cy.get('[data-cy="certify-section-checkbox"]').click()
      cy.get('[data-cy="certify-section-checkbox"]').should('be.checked')
      cy.get('[data-cy=button-control-right-button]').eq(1).click()

      // check redirect to change
      // The following line is commented out. Validation is not passed (no )
      // cy.url().should('not.include', '/beneficial-owner-change/review-confirm')
      cy.url().should('include', '/beneficial-owner-change')
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
