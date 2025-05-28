import { DeclarationTypeE } from '../../enums/declaration-type-e'

Cypress.Commands.add('fillOutForm', (siDataToEnter) => {
  // fill out the form
  switch (siDataToEnter.verificationStatus) {
    case DeclarationTypeE.self:
      cy.get('[data-cy="declaration-button-me"]').click()
      break
    case DeclarationTypeE.parent:
      cy.get('[data-cy="declaration-button-parent"]').click()
      cy.get('#individual-person-full-name').type(siDataToEnter.fullName)
      break
    case DeclarationTypeE.lawyer:
      cy.get('[data-cy="declaration-button-lawyer"]').click()
      cy.get('#individual-person-full-name').type(siDataToEnter.fullName)
      break
    case DeclarationTypeE.none:
      cy.get('[data-cy="declaration-button-none"]').click()
      cy.get('#individual-person-full-name').type(siDataToEnter.fullName)
      break
    default:
      break
  }

  cy.get('[data-cy=usePreferredName').check()
  cy.get('#individual-person-preferred-name').type(siDataToEnter.preferredName)
  cy.get('#individual-person-email').type(siDataToEnter.email)

  // enter shares and votes percentage
  cy.get('[data-cy="controlOfShares.percentage.2"]').click()
  cy.get('[data-cy="controlOfShares.beneficialOwner"]').check()
  cy.get('[data-cy="controlOfShares.registeredOwner"]').check()
  cy.get('[data-cy="controlOfVotes.percentage.3"]').click()
  cy.get('[data-cy="controlOfVotes.beneficialOwner"]').check()
  cy.get('[data-cy="controlOfVotes.registeredOwner"]').check()

  // select the control type (registred owner + direct control)
  // todo: fixme update with #20756
  // cy.get('[data-cy="testTypeOfControl"]').get('[name="registeredOwner"]').check()
  // cy.get('[data-cy="testControlOfDirectors"]').get('[name="directControl"]').check()

  // select the birthdate (here we just use today's date for simplicity)
  cy.get('#addNewPersonBirthdate').trigger('click')
  cy.get('[data-cy=date-picker]').get('.bcros-date-picker__calendar__day.dp__today').trigger('click')

  cy.get('[data-cy="start-date-select"]').click().then(() => {
    cy.get('.bcros-date-picker__calendar__day.dp__today').parent().click()
  })

  // enter the address
  cy.get('[data-cy="address-country"]').click()
  cy.get('[data-cy="address-country"]').get('li').contains(siDataToEnter.address.country).click()
  cy.get('[data-cy="address-line1-autocomplete"]').type(siDataToEnter.address.streetAddress)
  cy.get('[data-cy="address-city"]').type(siDataToEnter.address.city, { force: true })
  cy.get('[data-cy="address-region-select"]').click()
  cy.get('[data-cy="address-region-select"]').get('li').contains(siDataToEnter.address.province[0]).click()
  cy.get('[data-cy="address-postal-code"]').type(siDataToEnter.address.postalCode)

  // phone number
  cy.get('[data-cy="phoneNumber.number"]').type(siDataToEnter.phoneNumber.number)

  // select the citizenship info
  cy.get('[data-cy="citizenships.otherComboboxButton"]').click()
  cy.get('[id^="headlessui-combobox-options"]').find('li').first().click({ force: true })

  // enter tax number and select tax residency
  cy.get('[data-cy="tax-number-input"]').type(siDataToEnter.taxNumber)
  cy.get('[data-cy="testTaxResidency"]').get('[type="radio"][value="true"]').check()
})
