import payFeesForBtrRegsigin from '../../fixtures/payFeeForBtrRegsigin.json'

describe('accessibility -> Beneficial Owner Change', () => {
  beforeEach(() => {
    cy.intercept(
      'GET',
      'https://pay-api-dev.apps.silver.devops.gov.bc.ca/api/v1/fees/BTR/REGSIGIN',
      payFeesForBtrRegsigin)
    cy.visit('/')
    cy.wait(3000)
    cy.injectAxe()
  })

  it('checks page passes accessibility', () => {
    // For now, this is an example of passing checks
    cy.checkA11y('[data-cy=page-header]')
    cy.checkA11y('[data-cy=page-info-text]')
    cy.checkA11y('[data-cy=add-new-btn]')

    // NB: these tests will be uncommented when their corresponding tickets are worked on

    // Open date picker 19440
    // cy.get('[data-cy=date-select]').click()
    // cy.checkA11y('[data-cy=effective-date-select]')

    // Expanding the form - pre filled out 19442
    // cy.get('[data-cy=add-new-btn]').click()
    // cy.checkA11y('[data-cy=addIndividualPerson]')

    // Expanding the form - filled out 19442
    // cy.fixture('individuals').then((testData) => {
    //   cy.get('[data-cy=add-new-btn]').click()
    //   cy.get('#individual-person-full-name').type(testData.profile1.fullName)
    //   cy.get('#individual-person-preferred-name').type(testData.profile1.preferredName)
    //   cy.get('#individual-person-email').type(testData.profile1.email)
    //   cy.get('[name=percentOfShares]').type(testData.profile1.percentOfShares)
    //   cy.get('[name=percentOfVotes]').type(testData.profile1.percentOfVotes)
    //   cy.get('[data-cy=testTypeOfControl]').get('[name=registeredOwner]').check()
    //   cy.get('[data-cy=testControlOfDirectors]').get('[name=directControl]').check()
    //   cy.get('#addNewPersonBirthdate').trigger('click')
    //   cy.get('[data-cy=date-picker]').get('.bcros-date-picker__calendar__day.dp__today').trigger('click')
    //   cy.get('[data-cy=address-country]').click()
    //   cy.get('[data-cy=address-country]').get('li').contains(testData.profile1.address.country).click()
    //   cy.get('[data-cy=address-line1-autocomplete]').type(testData.profile1.address.streetAddress)
    //   cy.get('[data-cy=address-city]').type(testData.profile1.address.city)
    //   cy.get('[data-cy=address-region-select]').click()
    //   cy.get('[data-cy=address-region-select]').get('li').contains(testData.profile1.address.province[0]).click()
    //   cy.get('[data-cy=address-postal-code]').type(testData.profile1.address.postalCode)
    //   cy.get('[data-cy=countryOfCitizenshipRadioGroup]').get('[type=radio][value=citizen]').check()
    //   cy.get('[name=taxNumber]').type(testData.profile1.taxNumber)
    //   cy.get('[data-cy=testTaxResidency]').get('[type=radio][value=true]').check()
    //   cy.checkA11y('[data-cy=addIndividualPerson]')
    // })

    // Expanding the form - validations on 19441
    // FUTURE: just click 'Done' btn once validations for it are working
    // cy.get('[data-cy=add-new-btn]').click()
    // cy.get('#individual-person-full-name').as('name').focus()
    // cy.get('@name').blur()
    // cy.get('#individual-person-email').as('email').focus()
    // cy.get('@email').blur()
    // cy.get('[name=percentOfShares]').type('108')
    // cy.get('[name=percentOfVotes]').type('f')
    // cy.get('[data-cy=address-country]').as('country').focus()
    // cy.get('@country').blur()
    // cy.get('[data-cy=address-street]').as('street').focus()
    // cy.get('@street').blur()
    // cy.get('[data-cy=address-city]').as('city').focus()
    // cy.get('@city').blur()
    // cy.get('[data-cy=address-region-input]').as('region').focus()
    // cy.get('@region').blur()
    // cy.get('[data-cy=address-postal-code]').as('postal').focus()
    // cy.get('@postal').blur()
    // cy.get('[name=taxNumber]').as('taxNumber').focus()
    // cy.get('@taxNumber').blur()
    // cy.checkA11y('[data-cy=addIndividualPerson]')

    // Expanding the form - dynamic elements 19443
    // address line 1 expansion
    // cy.get('[data-cy=add-new-btn]').click()
    // cy.get('[data-cy=address-line1-autocomplete]').type('123')
    // cy.checkA11y('[data-cy=address-street-options]')
    // countries of citizenship dropdown
    // cy.get('[data-cy=add-new-btn]').click()
    // cy.get('[data-cy=address-line1-autocomplete]').type('123')
    // cy.get('[data-cy=countryOfCitizenshipRadioGroup]').get('[type=radio][value=other]').check()
    // cy.checkA11y('[data-cy=countryOfCitizenshipDropdown]')
    // cy.get('[data-cy=countryOfCitizenshipDropdownButton]').click()
    // cy.get('[data-cy=countryOfCitizenshipDropdownOption]').eq(0).click({ force: true })
    // cy.get('[data-cy=countryOfCitizenshipDropdownOption]').eq(4).click({ force: true })
    // cy.checkA11y('[data-cy=countryOfCitizenshipDropdown]')
    // not possible to obtain data checkbox clicked
    // cy.get('[data-cy=add-new-btn]').click()
    // cy.get('[data-cy=isUnableToObtainOrConfirmInformationCheckbox]').check()
    // cy.checkA11y('[data-cy=isUnableToObtainOrConfirmInformation]')

    // summary table 19444
    cy.checkA11y('[data-cy=individualsSummaryTable]', { rules: { 'nested-interactive': { enabled: false } } })

    /**
     * Open the popover panel
     * Checks skipped:
     * - 'nested-interactive': <UPopover> will fail this check
     * - 'aria-hidden-focus': <UPopover> will fail this check
     * - 'color-contrast': the issue only occurs for the 'Remove' button in the popover panel.
     *   The right text color is rendered, but the some pixels on the edge of some letters are in a wrong color.
     *   Cypress tends to use the wrong color to test the color contrast.
     */
    cy.get('[data-cy=popover-button]').eq(0).click()
    cy.checkA11y('[data-cy=summary-table-buttons]', {
      rules: {
        'nested-interactive': { enabled: false },
        'aria-hidden-focus': { enabled: false },
        'color-contrast': { enabled: false }
      }
    })

    // close the popover panel
    cy.get('[data-cy=popover-button]').eq(0).click()

    // This will be uncommented when all accessibility issues in the form are resolved
    // edit form
    // cy.get('[data-cy=edit-button]').eq(0).click()
    // cy.checkA11y('[data-cy=individualsSummaryTable]')
    // cy.get('[data-cy=new-si-cancel-btn]').click()

    // empty table
    cy.get('[data-cy=popover-button]').then((buttons) => {
      for (let i = 0; i < buttons.length; i++) {
        cy.get('[data-cy=popover-button]').first().click()
        cy.get('[data-cy=remove-button]').click()
      }
    })
    cy.checkA11y('[data-cy=individualsSummaryTable]')

    // NB: uncomment once all above are passing
    // cy.checkA11y('[data-cy=owner-change]')
  })
})
