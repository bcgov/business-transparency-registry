import { dateToString } from '../../../../../btr-common-components/utils/date'

describe('pages -> Add individual', () => {
  beforeEach(() => {
    cy.visitHomePageNoFakeData()
  })

  it('verify birth date minor warning is there, and goes away if 19+ age is selected', () => {
    cy.get('[data-cy=add-new-btn]').trigger('click')

    cy.get('input[name="birthDate"][data-cy="date-select"]').type('1999-01-01')
    cy.get('[data-cy="form-minor-warning"]').should('not.exist')

    const today = new Date()
    const todayString = dateToString(today, 'YYYY-MM-DD')

    cy.get('input[name="birthDate"][data-cy="date-select"]').clear().type(todayString)
    cy.get('[data-cy="form-minor-warning"]').should('exist')
  })
})
