import business from '../../fixtures/business.json'

describe('accessibility -> Business Layout', () => {
  beforeEach(() => {
    // setup intercepts
    cy.interceptPostsEntityApi().as('existingSIs')
    cy.interceptPayFeeApi().as('payFeeApi')
    cy.interceptBusinessContact().as('businessContact')
    cy.interceptBusinessSlim().as('businessApiCall')
  })

  it('checks business layout passes accessibility (logged out)', () => {
    sessionStorage.setItem('FAKE_LOGIN', '')
    cy.visit(`/${business.identifier}/beneficial-owner-change`)
    cy.wait(['@existingSIs', '@businessApiCall', '@payFeeApi', '@businessContact'])
    cy.injectAxe()
    // header only (logged out) 19450
    cy.checkA11y({ exclude: ['[data-cy=owner-change]'], include: ['[data-cy=header]'] })
    cy.get('[data-cy=logged-out-menu]').click()
    cy.wait(100)
    cy.checkA11y({ exclude: ['[data-cy=owner-change]'], include: ['[data-cy=header]'] })

    // breadcrumb only 19579
    cy.checkA11y({ exclude: ['[data-cy=owner-change]'], include: ['[data-cy=breadcrumb]'] })

    // business details only
    cy.checkA11y({ exclude: ['[data-cy=owner-change]'], include: ['[data-cy=business-details]'] })

    // fee summary only 19577
    // pre-form touched
    cy.checkA11y({ exclude: ['[data-cy=owner-change]'], include: ['[data-cy=pay-fees-widget]'] })
    // post-form touched
    cy.get('[data-cy=date-select]').click().then(() => {
      cy.get('.bcros-date-picker__calendar__day.dp__today').parent().click()
    })
    cy.checkA11y({ exclude: ['[data-cy=owner-change]'], include: ['[data-cy=pay-fees-widget]'] })

    // filing control buttons only
    cy.checkA11y({ exclude: ['[data-cy=owner-change]'], include: ['[data-cy=button-control]'] })
    cy.get('[data-cy=button-control-right-button]').click().then(() => {
      cy.checkA11y({ exclude: ['[data-cy=owner-change]'], include: ['[data-cy=button-control]'] })
    })

    // footer only 19455
    cy.checkA11y({ exclude: ['[data-cy=owner-change]'], include: ['[data-cy=footer]'] })

    // full layout (uncomment once all of the above are passing)
    // cy.checkA11y({ exclude: ['[data-cy=owner-change]'], include: ['[data-cy=business-layout]'] })
  })

  it('checks business layout passes accessibility (logged in)', () => {
    sessionStorage.setItem('FAKE_LOGIN', 'true')
    cy.visit(`/${business.identifier}/beneficial-owner-change`)
    cy.wait(['@existingSIs', '@businessApiCall', '@payFeeApi', '@businessContact'])
    cy.injectAxe()

    // header only (logged in) 17802
    cy.checkA11y({ exclude: ['[data-cy=owner-change]'], include: ['[data-cy=header]'] })
    cy.get('[data-cy=logged-in-menu]').click()

    cy.wait(100)
    cy.checkA11y({ exclude: ['[data-cy=owner-change]'], include: ['[data-cy=header]'] })

    // full layout (uncomment once all of the above are passing)
    // cy.checkA11y({ exclude: ['[data-cy=owner-change]'], include: ['[data-cy=business-layout]'] })
  })
})
