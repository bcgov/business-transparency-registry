describe('Layout -> ButtonControl', () => {
  it('shows button control in the business layout for SI change', () => {
    cy.visitHomePageNoFakeData()
    cy.get('#bcros-button-control').should('exist')
    cy.get('[data-cy=button-control-left-button]').should('have.length', 3)
    cy.get('[data-cy=button-control-left-button]').eq(0).should('have.text', 'Cancel')
    cy.get('[data-cy=button-control-left-button]').eq(1).should('have.text', 'Save and Resume Later')
    cy.get('[data-cy=button-control-left-button]').eq(2).should('have.text', 'Save')
    cy.get('[data-cy=button-control-right-button]').should('have.length', 1)
    cy.get('[data-cy=button-control-right-button]').eq(0).should('have.text', 'Review and Confirm')
  })

  it('shows button control in the business layout for SI change review', () => {
    cy.interceptPayFeeApi().as('payFeeApi')
    cy.interceptBusinessContact().as('businessContact')
    cy.interceptBusinessSlim().as('businessApiCall')
    cy.visit('/BC0871427/beneficial-owner-change/review-confirm')
    cy.wait(['@businessApiCall', '@payFeeApi', '@businessContact'])

    cy.get('#bcros-button-control').should('exist')
    cy.get('[data-cy=button-control-left-button]').should('have.length', 3)
    cy.get('[data-cy=button-control-left-button]').eq(0).should('have.text', 'Cancel')
    cy.get('[data-cy=button-control-left-button]').eq(1).should('have.text', 'Save and Resume Later')
    cy.get('[data-cy=button-control-left-button]').eq(2).should('have.text', 'Save')
    cy.get('[data-cy=button-control-right-button]').should('have.length', 2)
    cy.get('[data-cy=button-control-right-button]').eq(0).should('have.text', 'Back')
    cy.get('[data-cy=button-control-right-button]').eq(1).should('have.text', 'File Now (no fee)')
  })

  it('does NOT show button control in the person layout for profile', () => {
    cy.visit('/my-registries-details')
    cy.get('#bcros-button-control').should('not.exist')
  })
})
