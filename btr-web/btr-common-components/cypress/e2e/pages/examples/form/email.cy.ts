describe('forms -> email -> validate that email component work inside example form', () => {
  beforeEach(() => {
    // navigate to index page and check footer and header exist
    cy.visit('/examples/form')
  })

  it('verify email field validation rules', () => {
    cy.contains('Email address:')

    // invalid email
    cy.get('#testEmail').type('hrvoje..fekete@gmail.com').blur()
    // todo: investigate why is there uncaught error for zod form schema validation if we will use schema validation
    // cy.get('#exampleSubmitButton').click()
    cy.contains('Invalid email').should('exist')

    // clear, required
    cy.get('#testEmail').clear()

    // valid email
    cy.get('#testEmail').type('hrvoje.fekete@gmail.com').blur()
    cy.contains('Invalid email').should('not.exist')
  })
})
