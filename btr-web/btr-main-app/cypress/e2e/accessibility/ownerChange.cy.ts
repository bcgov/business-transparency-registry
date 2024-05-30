import 'cypress-plugin-tab'

describe('accessibility -> Beneficial Owner Change', () => {
  beforeEach(() => {
    cy.visitHomePageWithFakeDataAndAxeInject()
  })

  it('checks page passes accessibility', () => {
    // For now, this is an example of passing checks
    cy.checkA11y('[data-cy="significantIndividuals-heading"]')
    cy.checkA11y('[data-cy=page-info-text]')
    cy.checkA11y('[data-cy=add-new-btn]')

    // NB: these tests will be uncommented when their corresponding tickets are worked on

    // Expanding the form - pre filled out 19442
    cy.get('[data-cy=add-new-btn]').click()
    cy.checkA11y('[data-cy=addIndividualPerson]',
      {
        rules: {
          // todo: fixme: nested-interactive should be removed/set to true after resolving it after
          //  discussion with nuxt-ui team
          // first ticket for opening discussions: https://github.com/bcgov/entity/issues/19775
          'nested-interactive': { enabled: false }
        }
      }
    )

    // Expanding the form - filled out 19442
    // continue from previous expanded form, fill it out
    cy.fixture('individuals').then((testData) => {
      cy.get('#individual-person-full-name').type(testData.profile1.fullName)
      cy.get('[data-cy=usePreferredName').check()
      cy.get('#individual-person-preferred-name').type(testData.profile1.preferredName)
      cy.get('#individual-person-email').type(testData.profile1.email)
      cy.get('[data-cy="controlOfShares.percentage.0"]').click()
      cy.get('[data-cy="controlOfShares.beneficialOwner"]').check()
      cy.get('[data-cy="controlOfShares.registeredOwner"]').check()
      cy.get('[data-cy="controlOfVotes.percentage.0"]').click()
      cy.get('[data-cy="controlOfVotes.beneficialOwner"]').check()
      cy.get('[data-cy="controlOfVotes.registeredOwner"]').check()
      // todo: fixme update with #20756
      // cy.get('[data-cy=testControlOfDirectors]').get('[name=directControl]').check()
      cy.get('#addNewPersonBirthdate').trigger('click')
      cy.get('[data-cy=date-picker]').get('.bcros-date-picker__calendar__day.dp__today').trigger('click')
      cy.get('[data-cy=address-country]').click()
      cy.get('[data-cy=address-country]').get('li').contains(testData.profile1.address.country).click()
      cy.get('[data-cy=address-line1-autocomplete]').type(testData.profile1.address.streetAddress)
      cy.get('[data-cy=address-city]').type(testData.profile1.address.city)
      cy.get('[data-cy=address-region-select]').click()
      cy.get('[data-cy=address-region-select]').get('li').contains(testData.profile1.address.province[0]).click()
      cy.get('[data-cy=address-postal-code]').type(testData.profile1.address.postalCode)
      cy.get('[data-cy="countryOfCitizenshipDropdownButton"]').click()
      cy.get('[data-cy="countryOfCitizenshipDropdownOption"]').first().click({ force: true })
      cy.get('[data-cy="tax-number-input"]').type(testData.profile1.taxNumber)
      cy.get('[data-cy=testTaxResidency]').get('[type=radio][value=true]').check()
      cy.checkA11y('[data-cy=addIndividualPerson]',
        {
          rules: {
            // todo: fixme: nested-interactive should be removed/set to true after resolving it after
            //  discussion with nuxt-ui team
            // first ticket for opening discussions: https://github.com/bcgov/entity/issues/19775
            'nested-interactive': { enabled: false }
          }
        }
      )
    })

    // Expanding the form - validations on 19441
    cy.get('[data-cy=new-si-cancel-btn]').click()
    cy.get('[data-cy=add-new-btn]').click()
    cy.get('[data-cy=new-si-done-btn]').click()
    cy.checkA11y('[data-cy=addIndividualPerson]', { rules: { 'nested-interactive': { enabled: false } } })

    // Expanding the form - dynamic elements 19443
    // address line 1 expansion
    cy.get('[data-cy=address-line1-autocomplete]').type('123')
    cy.checkA11y('[data-cy=address-street-options]')
    // countries of citizenship dropdown
    cy.checkA11y('[data-cy=countryOfCitizenshipDropdown]')
    cy.get('[data-cy=countryOfCitizenshipDropdownButton]').click()
    cy.get('[data-cy=countryOfCitizenshipDropdownOption]').eq(0).click({ force: true })
    cy.get('[data-cy=countryOfCitizenshipDropdownOption]').eq(4).click({ force: true })
    cy.checkA11y('[data-cy=countryOfCitizenshipDropdown]')
    // not possible to obtain data checkbox clicked
    cy.get('[data-cy=isUnableToObtainOrConfirmInformationCheckbox]').check()
    cy.checkA11y('[data-cy=isUnableToObtainOrConfirmInformation]')

    // NB: uncomment once all above are passing
    // cy.checkA11y('[data-cy=owner-change]')
  })

  it('checks the summary table passes accessibility', () => {
    cy.checkA11y('[data-cy=individualsSummaryTable]', { rules: { 'nested-interactive': { enabled: false } } })

    /**
     * Open the popover panel
     * Checks skipped:
     * - 'nested-interactive': <UPopover> will fail this check
     * - 'aria-hidden-focus': <UPopover> will fail this check
     * Ticket #19775 is created to resolve these issues.
     */
    cy.get('[data-cy=popover-button]').eq(0).click()
    cy.wait(100)
    cy.checkA11y('[data-cy=summary-table-buttons]', {
      rules: {
        'nested-interactive': { enabled: false },
        'aria-hidden-focus': { enabled: false }
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
  })

  it('Verifies the date selector passes AA', () => {
    cy.get('[data-cy=add-new-btn]').click()
    cy.checkA11y('[data-cy="start-date-select"]')
    // Open date picker
    cy.get('[data-cy="start-date-select"]').click()
    // ignoring the aria-dialog-name rule because it fails on the imported datepicker component
    // - ticket created to resolve: https://github.com/bcgov/entity/issues/19777
    cy.checkA11y('[data-cy="start-date-select"]', { rules: { 'aria-dialog-name': { enabled: false } } })
  })

  it('Check if the tooltip works on tab focus', () => {
    cy.get('[data-cy=add-new-btn]').click()

    /**
     * Typing tab key does not work in Cypress.
     * The official doc (https://docs.cypress.io/api/commands/type#Tabbing) suggests using the cypress-plugin-tab plugin
     * https://github.com/kuceb/cypress-plugin-tab
     * The module is in beta and may have unexpected behavior.
     */

    // todo: update with 20926
    // // tab into the tooltip text in Type of Control section
    // cy.get('[name="inConcertControl"]').tab()
    // cy.get('[data-cy="in-concert-control-tooltip-content"').should('exist')
    //
    // // Note: the tooltip does not lose focus when tabbed out by tab()
    // // here we use blur() to simulate tabbing out
    // cy.get('[data-cy="in-concert-control-tooltip"]').blur()
    // cy.get('[data-cy="in-concert-control-tooltip-content"').should('not.exist')
  })
})
