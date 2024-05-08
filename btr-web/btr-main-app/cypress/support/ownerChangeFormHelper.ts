Cypress.Commands.add('fillOutForm', (siDataToEnter) => {
    // fill out the form
    cy.get('#individual-person-full-name').type(siDataToEnter.fullName)
    cy.get('[data-cy=usePreferredName').check()
    cy.get('#individual-person-preferred-name').type(siDataToEnter.preferredName)
    cy.get('#individual-person-email').type(siDataToEnter.email)

    // enter shares and votes percentage
    // todo: fixme: update on #20758
    // cy.get('[data-cy=testPercentOfShares]').click().find('li').eq(0).click()
    // cy.get('[data-cy=testPercentOfVotes]').click().find('li').eq(0).click()

    // select the control type (registred owner + direct control)
    // todo: fixme update with #20756
    // cy.get('[data-cy="testTypeOfControl"]').get('[name="registeredOwner"]').check()
    // cy.get('[data-cy="testControlOfDirectors"]').get('[name="directControl"]').check()

    // select the birthdate (here we just use today's date for simplicity)
    cy.get('#addNewPersonBirthdate').trigger('click')
    cy.get('[data-cy=date-picker]').get('.bcros-date-picker__calendar__day.dp__today').trigger('click')

    // enter the address
    cy.get('[data-cy="address-country"]').click()
    cy.get('[data-cy="address-country"]').get('li').contains(siDataToEnter.address.country).click()
    cy.get('[data-cy="address-line1-autocomplete"]').type(siDataToEnter.address.streetAddress)
    cy.get('[data-cy="address-city"]').type(siDataToEnter.address.city)
    cy.get('[data-cy="address-region-select"]').click()
    cy.get('[data-cy="address-region-select"]').get('li').contains(siDataToEnter.address.province[0]).click()
    cy.get('[data-cy="address-postal-code"]').type(siDataToEnter.address.postalCode)

    // select the citizenship info
    cy.get('[data-cy="countryOfCitizenshipDropdownButton"]').click()
    cy.get('[data-cy="countryOfCitizenshipDropdownOption"]').eq(0).click({ force: true })

    // enter tax number and select tax residency
    cy.get('[data-cy="tax-number-input"]').type(siDataToEnter.taxNumber)
    cy.get('[data-cy="testTaxResidency"]').get('[type="radio"][value="true"]').check()
  }
)
