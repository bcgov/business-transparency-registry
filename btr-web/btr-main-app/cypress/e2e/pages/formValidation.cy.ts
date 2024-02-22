describe('pages -> Form Validation', () => {
  let i18nCommon: any
  let i18n: any
  beforeEach(() => {
    cy.readFile('../btr-common-components/lang/en.json').then((json) => { i18nCommon = json })
    cy.readFile('lang/en.json').then((json) => { i18n = json })

    cy.visitHomePageWithFakeData()
  })

  it('Validations are applied throughout the form', () => {
    // Click the Done button without filling out the form
    cy.get('[data-cy=add-new-btn]').click()
    cy.get('[data-cy=new-si-done-btn]').click()

    // Check for all the error messages
    cy.contains(i18nCommon.errors.validation.fullName.empty).should('exist')
    cy.contains(i18nCommon.errors.validation.email.empty).should('exist')
    cy.contains(i18n.errors.validation.controlPercentage.empty).should('not.exist')
    cy.contains(i18n.errors.validation.sharesAndVotes.required).should('not.exist')
    cy.contains(i18n.errors.validation.controlOfDirectors.required).should('not.exist')
    cy.contains(i18n.errors.validation.birthDate.required).should('exist')
    cy.contains(i18n.errors.validation.citizenship.required).should('exist')
    cy.contains(i18n.errors.validation.address.country).should('exist')
    cy.contains(i18n.errors.validation.address.line1).should('exist')
    cy.contains(i18n.errors.validation.address.city).should('exist')
    cy.contains(i18n.errors.validation.address.region).should('exist')
    cy.contains(i18n.errors.validation.address.postalCode).should('exist')
    cy.contains(i18n.errors.validation.taxNumber.required).should('exist')
    cy.contains(i18n.errors.validation.taxResidency.required).should('exist')
    cy.contains(i18n.errors.validation.missingInfoReason.required).should('not.exist')
  })

  it('Form validation for Citizenship', () => {
    cy.get('[data-cy=add-new-btn]').click()
    cy.get('[data-cy=new-si-done-btn]').click()
    cy.contains(i18n.errors.validation.citizenship.required).should('exist')

    // Selecting "Canadian citizenship" should remove the error
    cy.get('[data-cy="countryOfCitizenshipRadioGroup"]').get('[type="radio"][value="citizen"]').check()
    cy.contains(i18n.errors.validation.citizenship.required).should('not.exist')

    // Checking "Other" without selecting countries should trigger an error
    cy.get('[data-cy="countryOfCitizenshipRadioGroup"]').get('[type="radio"][value="other"]').check()
    cy.get('[data-cy=new-si-done-btn]').click()
    cy.contains(i18n.errors.validation.citizenship.required).should('not.exist')
    cy.contains(i18n.errors.validation.citizenship.otherCountry).should('exist')

    // Select the first foreign country
    cy.get('[data-cy="countryOfCitizenshipDropdownButton"]').click()
    cy.get('[data-cy="countryOfCitizenshipDropdownOption"]').first().click({ force: true })
    cy.contains(i18n.errors.validation.citizenship.otherCountry).should('not.exist')
  })

  it('Form validation for Control of Shares and Votes', () => {
    cy.get('[data-cy=add-new-btn]').click()
    cy.get('[data-cy=new-si-done-btn]').click()
    cy.contains(i18n.errors.validation.controlPercentage.empty).should('not.exist')
    cy.contains(i18n.errors.validation.sharesAndVotes.required).should('not.exist')

    // If one of the control types is selected, the percentage of shares and votes should be required
    // To remove the error,
    // 1) enter percent of shares or percent of votes
    // 2) uncheck the control type
    cy.get('[name="registeredOwner"]').check()
    cy.get('[data-cy=new-si-done-btn]').click()
    cy.contains(i18n.errors.validation.controlPercentage.empty).should('exist')
    cy.get('[name="registeredOwner"]').uncheck()
    cy.contains(i18n.errors.validation.controlPercentage.empty).should('not.exist')
    cy.get('[name="registeredOwner"]').check()
    cy.get('[data-cy=new-si-done-btn]').click()
    cy.get('[name="percentOfShares"]').type('30').blur()
    cy.contains(i18n.errors.validation.controlPercentage.empty).should('not.exist')

    // if the in-concert control is selected, the percentage of shares and votes is required, and the
    // control type is required
    cy.get('[data-cy=new-si-cancel-btn]').click()
    cy.get('[data-cy=add-new-btn]').click()
    cy.get('[name="inConcertControl"]').check()
    cy.get('[data-cy=new-si-done-btn]').click()
    cy.contains(i18n.errors.validation.controlPercentage.empty).should('exist')
    cy.contains(i18n.errors.validation.controlOfDirectors.required).should('exist')
    // unchecking the in-concert control should remove the errors
    cy.get('[name="inConcertControl"]').uncheck()
    cy.contains(i18n.errors.validation.controlPercentage.empty).should('not.exist')
    cy.contains(i18n.errors.validation.controlOfDirectors.required).should('not.exist')

    // if either the percent of shares or the percent of votes is >= 25%, the control type is required
    cy.get('[data-cy=new-si-cancel-btn]').click()
    cy.get('[data-cy=add-new-btn]').click()
    cy.get('[name="percentOfShares"]').type('10').blur()
    cy.get('[data-cy=new-si-done-btn]').click()
    cy.contains(i18n.errors.validation.controlOfDirectors.required).should('not.exist')
    cy.get('[name="percentOfShares"]').clear().type('30').blur()
    cy.get('[data-cy=new-si-done-btn]').click()
    cy.contains(i18n.errors.validation.controlOfDirectors.required).should('exist')
    cy.get('[name="registeredOwner"]').check()
    cy.contains(i18n.errors.validation.controlOfDirectors.required).should('not.exist')
  })
})
