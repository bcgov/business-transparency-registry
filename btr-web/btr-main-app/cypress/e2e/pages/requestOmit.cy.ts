describe('pages -> Request To Omit', () => {
  beforeEach(() => {
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
    cy.get('[name="completingParty.type"]').should('exist')
    cy.get('[name="completingParty.fullName"]').should('exist')
    cy.get('[name="completingParty.email"]').should('exist')
    cy.get('[data-cy="certify-section"]').should('exist')
  })
})
