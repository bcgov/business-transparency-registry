import { SubmissionTypeE } from '../../../../btr-main-app/enums/submission-type-e'

describe('accessibility -> Review and Confirm', () => {
  it('checks page passes accessibility (empty form)', () => {
    cy.visitHomePageNoFakeData()
    cy.injectAxe()
    cy.get('[data-cy=noSignificantIndividualsExist-checkbox]').check()
    cy.get('[data-cy=button-control-right-button]').click()
    cy.location('pathname').should('include', '/review-confirm')
    cy.checkA11y('[data-cy=review-confirm]')
  })

  it('checks page passes accessibility (form filled out)', () => {
    cy.visitHomePageWithFakeDataAndAxeInject(undefined, SubmissionTypeE.CHANGE_FILING)
    // enter form data
    cy.fixture('individuals').then((testData) => {
      cy.get('[data-cy=add-new-btn]').click()
      cy.get('#individual-person-full-name').type(testData.profile1.fullName)
      cy.get('[data-cy=usePreferredName]').check()
      cy.get('#individual-person-preferred-name').type(testData.profile1.preferredName)
      cy.get('#individual-person-email').type(testData.profile1.email)
      cy.get('[data-cy="controlOfShares.percentage.0"]').click()
      cy.get('[data-cy="controlOfShares.beneficialOwner"]').check()
      cy.get('[data-cy="controlOfShares.registeredOwner"]').check()
      cy.get('[data-cy="controlOfVotes.percentage.0"]').click()
      cy.get('[data-cy="controlOfVotes.beneficialOwner"]').check()
      cy.get('[data-cy="controlOfVotes.registeredOwner"]').check()
      cy.get('[data-cy="start-date-select"]').click().then(() => {
        cy.get('.bcros-date-picker__calendar__day.dp__today').parent().click()
      })
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
      cy.get('[data-cy="citizenshipsComboboxButton"]').click()
      cy.get('[id^="headlessui-combobox-options"]').find('li').first().click({ force: true })
      cy.get('[data-cy="tax-number-input"]').type(testData.profile1.taxNumber)
      cy.get('[data-cy=testTaxResidency]').get('[type=radio][value=true]').check()
      cy.get('[data-cy="phoneNumber.number"]').type('123123')
      cy.get('[data-cy=new-si-done-btn]').click()
    })
    // // go to review / confirm page
    cy.get('[data-cy=button-control-right-button]').click().then(() => {
      // // enter folio
      cy.get('[data-cy="significantIndividualChangeFolioNumberTextArea"]').type('123123')
      // // check certify
      cy.get('[data-cy="certify-section-checkbox"]').check()
    })
    // check AA
    cy.checkA11y('[data-cy=review-confirm]', { rules: { 'color-contrast': { enabled: false } } })
  })
})
