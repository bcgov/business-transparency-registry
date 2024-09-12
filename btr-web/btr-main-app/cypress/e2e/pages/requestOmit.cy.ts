describe('pages -> Request To Omit', () => {
  let i18nCommon: any
  let i18n: any
  beforeEach(() => {
    cy.readFile('../btr-common-components/lang/en.json').then((json) => { i18nCommon = json })
    cy.readFile('lang/en.json').then((json) => { i18n = json })
    cy.visit('/request-to-omit')
  })

  it('rendered expected visuals', () => {
    cy.get('[data-cy=request-to-omit-header]').should('contain', 'BC Business Transparency Registry')
    cy.get('[data-cy=request-to-omit-title]')
      .should(
        'contain', 'Request to Omit Information'
      )
    cy.get('[data-cy=request-to-omit-text]').should('contain',
      'You can request to have some or all of your information publicly omitted '
    )
  })

  it('Completing Party works as expected', () => {
    cy.get('#completingParty').should('exist')
    cy.get('[name="name"]').should('exist')
    cy.get('[name="email"]').should('exist')
    cy.get('[data-cy="certify-section"]').should('exist')
    cy.get('input[name="invididualType"]').should('exist')
  })

  it('Validation checks', () => {
    cy.get('[name="name"]').type('123')
    cy.contains(i18nCommon.errors.validation.fullName.specialCharacter).should('exist')
    cy.contains(i18nCommon.errors.validation.fullName.empty).should('not.exist')
    cy.get('[name="name"]').clear()
    cy.contains(i18nCommon.errors.validation.fullName.specialCharacter).should('not.exist')
    cy.contains(i18nCommon.errors.validation.fullName.empty).should('exist')
    cy.get('[name="name"]').type('John Doe')
    cy.contains(i18nCommon.errors.validation.fullName.specialCharacter).should('not.exist')
    cy.contains(i18nCommon.errors.validation.fullName.empty).should('not.exist')

    cy.get('[name="email"]').type('123')
    cy.get('[name="name"]').click();
    cy.contains(i18nCommon.errors.validation.email.invalid).should('exist')
    cy.contains(i18nCommon.errors.validation.email.empty).should('not.exist')
    cy.get('[name="email"]').clear()
    cy.get('[name="name"]').click();
    cy.contains(i18nCommon.errors.validation.email.invalid).should('not.exist')
    cy.contains(i18nCommon.errors.validation.email.empty).should('exist')
    cy.get('[name="email"]').type('John@Doe.ca')
    cy.get('[name="name"]').click();
    cy.contains(i18nCommon.errors.validation.email.invalid).should('not.exist')
    cy.contains(i18nCommon.errors.validation.email.empty).should('not.exist')

    cy.contains(i18n.errors.validation.certify).should('not.exist')
    cy.get('[data-cy="new-omit-done-btn"]').click()
    cy.contains(i18n.errors.validation.certify).should('exist')
    cy.get('[name="certification"]').click()
    cy.contains(i18n.errors.validation.certify).should('not.exist')
  })
})
