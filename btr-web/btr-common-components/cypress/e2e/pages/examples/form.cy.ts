describe('forms -> validate that form component work inside form', () => {
  beforeEach(() => {
    // navigate to index page and check footer and header exist
    cy.visit('/examples/form')
  })

  it('verify email field validation rules', () => {
    cy.contains('Email address:')

    // invalid email
    cy.get('#testEmail').type('hrvoje..fekete@gmail.com')
    cy.get('#exampleSubmitButton').click()
    cy.contains('Invalid email').should('exist')

    // clear, required
    cy.get('#testEmail').clear().blur()

    // valid email
    cy.get('#testEmail').type('hrvoje.fekete@gmail.com').blur()
    cy.contains('Invalid email').should('not.exist')


  })

  it('verify summary table is rendered', () => {
    const summaryTableHeaders = cy.get('[data-cy="individualsSummaryTable"]').get('th')
    summaryTableHeaders.children()
      .should('contain', 'Name')
      .and('contain', 'Address')
      .and('contain', 'Details')
      .and('contain', 'Significance Dates')
      .and('contain', 'Controls')
  })
})
