describe('pages -> Form Validation', () => {
  let i18nCommon: any
  let i18n: any
  beforeEach(() => {
    cy.readFile('../btr-common-components/i18n/locales/en.json').then((json) => { i18nCommon = json })
    cy.readFile('i18n/locales/en.json').then((json) => { i18n = json })

    cy.visitHomePageWithFakeData()
  })

  it('Validations are applied throughout the form', () => {
    // Click the Done button without filling out the form
    cy.get('[data-cy=add-new-btn]').click()
    cy.get('[data-cy=new-si-done-btn]').click()

    // Check for all the error messages
    cy.contains(i18nCommon.errors.validation.fullName.empty).should('exist')
    cy.contains(i18nCommon.errors.validation.email.empty).should('exist')
    cy.contains(i18n.errors.validation.control).should('exist')
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
    cy.contains(i18n.errors.validation.phoneNumber.required).should('exist')
    cy.contains(i18n.errors.validation.taxNumber.required).should('exist')
    cy.contains(i18n.errors.validation.taxResidency.required).should('exist')
    cy.contains(i18n.errors.validation.missingInfoReason.required).should('not.exist')
  })

  it('Form validation for Citizenship', () => {
    cy.get('[data-cy=add-new-btn]').click()
    cy.get('[data-cy=new-si-done-btn]').click()
    cy.contains(i18n.errors.validation.citizenship.required).should('exist')

    // Selecting a country should remove the error
    cy.get('[data-cy="citizenships.otherComboboxButton"]').click()
    cy.get('[id^="headlessui-combobox-options"]').find('li').first().click({ force: true })
    cy.contains(i18n.errors.validation.citizenship.required).should('not.exist')
  })

  it('Form validation for Control of Shares ', () => {
    cy.get('[data-cy=add-new-btn]').click()
    cy.get('[data-cy=new-si-done-btn]').click()
    cy.contains(i18n.errors.validation.controlPercentage.empty).should('not.exist')
    cy.contains(i18n.errors.validation.sharesAndVotes.required).should('not.exist')

    // If one of the control types is selected, the percentage of shares and votes should be required
    // To remove the error,
    // 1) select percent of shares or percent of votes
    // 2) uncheck the control type
    cy.get('[data-cy="controlOfShares.registeredOwner"]').check()
    cy.get('[data-cy=new-si-done-btn]').click()
    cy.contains(i18n.errors.validation.controlPercentage.empty).should('exist')
    cy.get('[data-cy="controlOfShares.registeredOwner"]').uncheck()
    cy.contains(i18n.errors.validation.controlPercentage.empty).should('not.exist')
    cy.get('[data-cy="controlOfShares.registeredOwner"]').check()
    cy.get('[data-cy=new-si-done-btn]').click()
    cy.get('[data-cy="controlOfShares.percentage.1"]').click()
    cy.contains(i18n.errors.validation.controlPercentage.empty).should('not.exist')

    // if the in-concert control is selected, the percentage of shares and votes is required, and the
    // control type is required
    cy.get('[data-cy=new-si-cancel-btn]').click()
    cy.get('[data-cy=add-new-btn]').click()
    cy.get('[data-cy="controlOfShares.jointlyOrInConcert.hasJointlyOrInConcert"]').check()
    cy.get('[data-cy="controlOfShares.jointlyOrInConcert.actingJointly"]').check()
    cy.get('[data-cy=new-si-done-btn]').click()
    cy.contains(i18n.errors.validation.controlPercentage.empty).should('exist')
    cy.contains(i18n.errors.validation.sharesAndVotes.required).should('exist')
    // unchecking the in-concert control should remove the errors
    cy.get('[data-cy="controlOfShares.jointlyOrInConcert.actingJointly"]').uncheck()
    cy.get('[data-cy="controlOfShares.jointlyOrInConcert.hasJointlyOrInConcert"]').uncheck()
    cy.contains(i18n.errors.validation.controlPercentage.empty).should('not.exist')
    cy.contains(i18n.errors.validation.sharesAndVotes.required).should('not.exist')

    // if the percent of shares is selected the control type is required
    cy.get('[data-cy=new-si-cancel-btn]').click()
    cy.get('[data-cy=add-new-btn]').click()
    cy.get('[data-cy="controlOfShares.beneficialOwner"]').check()
    cy.get('[data-cy=new-si-done-btn]').click()
    cy.contains(i18n.errors.validation.sharesAndVotes.required).should('not.exist')
    cy.get('[data-cy="controlOfShares.beneficialOwner"]').uncheck()
    cy.get('[data-cy="controlOfShares.percentage.1"]').click()
    cy.get('[data-cy=new-si-done-btn]').click()
    cy.contains(i18n.errors.validation.sharesAndVotes.required).should('exist')
    cy.get('[data-cy="controlOfShares.registeredOwner"]').check()
    cy.contains(i18n.errors.validation.sharesAndVotes.required).should('not.exist')
  })

  it('Form validation for Control of Votes ', () => {
    cy.get('[data-cy=add-new-btn]').click()
    cy.get('[data-cy=new-si-done-btn]').click()
    cy.contains(i18n.errors.validation.controlPercentage.empty).should('not.exist')
    cy.contains(i18n.errors.validation.sharesAndVotes.required).should('not.exist')

    // If one of the control types is selected, the percentage of shares and votes should be required
    // To remove the error,
    // 1) select percent of shares or percent of votes
    // 2) uncheck the control type
    cy.get('[data-cy="controlOfVotes.registeredOwner"]').check()
    cy.get('[data-cy=new-si-done-btn]').click()
    cy.contains(i18n.errors.validation.controlPercentage.empty).should('exist')
    cy.get('[data-cy="controlOfVotes.registeredOwner"]').uncheck()
    cy.contains(i18n.errors.validation.controlPercentage.empty).should('not.exist')
    cy.get('[data-cy="controlOfVotes.registeredOwner"]').check()
    cy.get('[data-cy=new-si-done-btn]').click()
    cy.get('[data-cy="controlOfVotes.percentage.1"]').click()
    cy.contains(i18n.errors.validation.controlPercentage.empty).should('not.exist')

    // if the in-concert control is selected, the percentage of shares and votes is required, and the
    // control type is required
    cy.get('[data-cy=new-si-cancel-btn]').click()
    cy.get('[data-cy=add-new-btn]').click()
    cy.get('[data-cy="controlOfVotes.jointlyOrInConcert.hasJointlyOrInConcert"]').check()
    cy.get('[data-cy="controlOfVotes.jointlyOrInConcert.actingJointly"]').check()
    cy.get('[data-cy=new-si-done-btn]').click()
    cy.contains(i18n.errors.validation.controlPercentage.empty).should('exist')
    cy.contains(i18n.errors.validation.sharesAndVotes.required).should('exist')
    // unchecking the in-concert control should remove the errors
    cy.get('[data-cy="controlOfVotes.jointlyOrInConcert.actingJointly"]').uncheck()
    cy.get('[data-cy="controlOfVotes.jointlyOrInConcert.hasJointlyOrInConcert"]').uncheck()
    cy.contains(i18n.errors.validation.controlPercentage.empty).should('not.exist')
    cy.contains(i18n.errors.validation.sharesAndVotes.required).should('not.exist')

    // if the percent of shares is selected the control type is required
    cy.get('[data-cy=new-si-cancel-btn]').click()
    cy.get('[data-cy=add-new-btn]').click()
    cy.get('[data-cy="controlOfVotes.beneficialOwner"]').check()
    cy.get('[data-cy=new-si-done-btn]').click()
    cy.contains(i18n.errors.validation.sharesAndVotes.required).should('not.exist')
    cy.get('[data-cy="controlOfVotes.beneficialOwner"]').uncheck()
    cy.get('[data-cy="controlOfVotes.percentage.1"]').click()
    cy.get('[data-cy=new-si-done-btn]').click()
    cy.contains(i18n.errors.validation.sharesAndVotes.required).should('exist')
    cy.get('[data-cy="controlOfVotes.registeredOwner"]').check()
    cy.contains(i18n.errors.validation.sharesAndVotes.required).should('not.exist')
  })

  it(`when the 'Unable to Obtain or Confirm Information' checkbox is checked, only name, declaration, and reason 
    for missing information is required`, () => {
    cy.get('[data-cy=add-new-btn]').click()
    cy.get('input[data-cy="testFullName"]').focus().type('my name')
    cy.get('[data-cy="declaration-button-none"]').click()
    cy.get('[data-cy="isUnableToObtainOrConfirmInformationCheckbox"]').check()
    cy.get('[data-cy="isUnableToObtainOrConfirmInformationTextArea"] >> textarea')
      .type('Missing information reason')

    cy.get('[data-cy=new-si-done-btn]').click()
    cy.get('[data-cy="addIndividualPerson"]').should('not.exist')
  })

  it(`when editing an existing SI with full information, we should be able to delete required fields when 
    Unable to Obtain or Confirm Information is checked`, () => {
    cy.get('[data-cy=action-button]').eq(3).click()
    cy.get('[data-cy="isUnableToObtainOrConfirmInformationCheckbox"]').check()
    cy.get('[data-cy="isUnableToObtainOrConfirmInformationTextArea"] >> textarea')
      .type('Missing information reason')

    // delete email
    cy.get('[data-cy="testEmail"] input').type('AA').blur()
    cy.contains(i18nCommon.errors.validation.email.invalid).should('exist')
    cy.get('[data-cy="testEmail"] input').type('{backspace}{backspace}').blur()

    // delete street address
    cy.get('[data-cy="address-street"]').type('AA').blur().type('{backspace}{backspace}').blur()

    // select other citizenship without selecting any country
    cy.get('[data-cy="citizenships-other-radio"]').click()

    // should be able to save changes by clicking the Done button
    cy.get('[data-cy=new-si-done-btn]').click()
    cy.get('[data-cy="addIndividualPerson"]').should('not.exist')
  })

  it(`When editing an existing SI with missing information, we should be able to add more information.
   trigger all errors: email, physical address, control type.`, () => {
    cy.get('[data-cy=action-button]').eq(0).click()
    const email = 'new_email@email.com'
    const streetAddress = '123 Main St'
    const city = 'town'
    const postalCode = 'abc123'
    const birthdate = '1990-01-01'

    // add email
    // when email is invalid, it should show an error
    cy.get('[data-cy="testEmail"] input').type('AA').blur()
    cy.contains(i18nCommon.errors.validation.email.invalid).should('exist')
    cy.get('[data-cy="testEmail"] input').type(email).blur()

    // add physical address
    cy.get('[data-cy="address-street"]').type(streetAddress).blur()
    cy.get('[data-cy="address-city"]').type(city).blur()
    cy.get('[data-cy="address-postal-code"]').type(postalCode).blur()

    // add birthdate
    cy.get('input[name="birthDate"][data-cy="date-select"]').type(birthdate).blur()

    // click done button
    cy.get('[data-cy=new-si-done-btn]').click()
    cy.get('[data-cy="addIndividualPerson"]').should('not.exist')

    // verify the added information is displayed in the summary table
    const updatedSI = cy.get('[data-cy="summary-table-row"]').first()
    updatedSI.get('[data-cy=summary-table-details]').contains(email)
    updatedSI.get('[data-cy=summary-table-details]').contains(streetAddress)
    updatedSI.get('[data-cy=summary-table-details]').contains(city)
    updatedSI.get('[data-cy=summary-table-details]').contains(postalCode)
    updatedSI.get('[data-cy=summary-table-name]').contains(birthdate)
  })
})
