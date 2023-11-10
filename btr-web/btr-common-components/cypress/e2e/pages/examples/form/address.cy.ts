describe('forms -> address -> validate that address component work inside exmample form', () => {
  beforeEach(() => {
    // navigate to index page and check footer and header exist
    cy.visit('/examples/form')
    cy.wait(1000)
  })

  it('displays address component', () => {
    cy.get('[data-cy="address-country"]').should('exist')
    cy.get('[data-cy="address-line1-autocomplete"]').should('exist')
    cy.get('[data-cy="address-line2"]').should('exist')
    cy.get('[data-cy="address-region-input"]').should('exist')
    cy.get('[data-cy="address-region-select"]').should('not.exist')
    cy.get('[data-cy="address-city"]').should('exist')
    cy.get('[data-cy="address-postal-code"]').should('exist')
    cy.get('[data-cy="address-location-description"]').should('exist')
  })

  it.skip('can select provinces for canada and us', () => {
    // cy.get('[data-cy="address-country"]').click()
    // todo: investigate how to fetch and work with USelectMenu in the cypress ...
    // cy.get('Canada').click()
    // cy.get('[data-cy="address-region-input"]').should('not.exist')
    // cy.get('[data-cy="address-region-select"]').should('exist')
  })

  it.skip('auto populates province, city and postal code', () => {
    // cy.get('[data-cy="address-line1-autocomplete"]').type('V6E 1H5')
    // todo: investigate how to fetch and work with autopopulate combo in the cypress ...
  })
})
