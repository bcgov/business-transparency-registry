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
    // todo: fix with 21137
    // cy.contains(i18n.errors.validation.address.country).should('exist')
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

    // Selecting a country should remove the error
    cy.get('[data-cy="countryOfCitizenshipDropdownButton"]').click()
    cy.get('[data-cy="countryOfCitizenshipDropdownOption"]').eq(0).click({ force: true })
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
})
