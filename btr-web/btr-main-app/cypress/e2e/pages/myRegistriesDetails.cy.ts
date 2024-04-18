describe('pages -> My Registries Details', () => {
  beforeEach(() => {
    cy.visit('/my-registries-details')
  })

  it('rendered expected visuals', () => {
    cy.get('[data-cy=myRegDetailsHeader]').should('contain', 'My BC Registries Details')
    cy.get('[data-cy=myRegDetailsHeaderSub]')
      .should('contain', 'Your BC Registries Details are shared with businesses that list you as a beneficial owner.')
    cy.get('[data-cy=myRegDetailsSectionHeader]').should('contain', 'Your Details')
    cy.get('[data-cy=myRegDetailsTable]').should('exist')
  })

  it('shows expected profile values in the information table', () => {
    cy.get('[data-cy=myRegDetailsTable]').get('tr').should('have.length', 9) // +1 for header tr
    cy.get('[data-cy=myRegDetailsTable]').get('td').should('have.length', 16)

    const expectedData = [
      { label: "Individual's Full Name", value: 'Wallaby Wobbles' },
      { label: 'Birthdate', value: 'September 25, 1993' },
      { label: 'Residential Address', value: '123 Fake StVictoria BC\u00A0\u00A0V2L 3T6Canada' },
      { label: 'Email Address', value: '1@1.com' },
      {
        label: 'Canada Revenue Agency (CRA) Tax Number',
        subLabel: 'Social Insurance Number (SIN)',
        value: '123 456 789'
      },
      { label: 'Citizenship/Permanent Residency', subLabel: 'Citizenship', value: 'Canada' },
      { label: 'Tax Residency', value: 'Canada' },
      { label: 'Competency', value: 'I am able to manage my own financial affairs.' }
    ]

    for (let i = 0; i < expectedData.length; i++) {
      const offset = i * 2
      cy.get('[data-cy=myRegDetailsTable]').get('td').eq(offset).should('contain.text', expectedData[i].label)
      if (expectedData[i].subLabel) {
        cy.get('[data-cy=myRegDetailsTable]').get('td').eq(offset).should('contain.text', expectedData[i].subLabel)
      }
      cy.get('[data-cy=myRegDetailsTable]').get('td').eq(offset + 1).should('contain.text', expectedData[i].value)
    }
  })
})
