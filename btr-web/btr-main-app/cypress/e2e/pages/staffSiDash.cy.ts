import * as i18nCommon from '../../../../btr-common-components/lang/en.json'
import * as i18n from '../../../lang/en.json'
describe('pages -> Staff SI Dashboard', () => {
  // let i18nCommon: any
  // let i18n: any
  beforeEach(() => {
    // cy.readFile('../btr-common-components/lang/en.json').then((json) => { i18nCommon = json })
    // cy.readFile('lang/en.json').then((json) => { i18n = json })
    cy.visit('/staff-si-dashboard')
    cy.interceptBusinessSlim().as('businessApiCall')
  })

  it('rendered expected visuals', () => {
    cy.fixture('requests').then((testData) => {
      cy.intercept(
        'GET',
        '**/requests**',
        testData)
      // cy.get('[data-cy="staff-si-dash-header"]').should('contain', 'Significant Individual Management')
      cy.get('[data-cy="staff-si-dash-text"]')
        .should(
          'contain', 'Search for businesses and manage BC Registries accounts'
        )
      cy.get('[data-cy="siRequestTableSection"]').should('contain',
        'Request to Omit Significant Individual Information'
      )

      cy.get('[data-cy="siRequestTableSection"]').should('contain',
        'Days In Queue'
      )
      cy.get('[data-cy="siRequestTableSection"]').should('contain',
        'Business Name'
      )
      cy.get('[data-cy="siRequestTableSection"]').should('contain',
        'Significant Individual'
      )
      cy.get('[data-cy="siRequestTableSection"]').should('contain',
        'Completing Party'
      )
      cy.get('[data-cy="siRequestTableSection"]').should('contain',
        'Status'
      )

      cy.get('[data-cy="siRequestTableSection"]').should('contain',
        'Actions'
      )
    })

  })

  it('Sort columns are clickable', () => {
    cy.fixture('requests').then((testData) => {
      cy.intercept(
        'GET',
        '**/requests**',
        testData)
      cy.get('[data-cy="header-item-button-createdAt"]').should('exist')
      cy.get('[data-cy="header-item-button-createdAt"]').click()

      cy.get('[data-cy="header-item-button-status"]').should('exist')
      cy.get('[data-cy="header-item-button-status"]').click()
      
    })
  })

  it('filter boxes exist', () => {
    cy.fixture('requests').then((testData) => {
      cy.intercept(
        'GET',
        '**/requests**',
        testData)
      cy.get('input[placeholder="Significant Individual"]').should('exist')

      cy.get('tr').eq(1).find('button').should('exist')
      
    })
  })

  it('rendered empty table', () => {
    cy.intercept(
      'GET',
      '**/requests**',
      { count: 0, results:[] })
    cy.get('tbody').should('contain', 'No Results')
  })
})
