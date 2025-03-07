const getString = function (n) {
  let str = ''
  const characters =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const charLen = characters.length

  for (let i = 0; i < n; i++) {
    // Generating a random index
    const idx = Math.floor(Math.random() * charLen)

    str += characters.charAt(idx)
  }

  return str
}

describe('pages -> Staff SI Dashboard', () => {
  beforeEach(() => {
    cy.visit('/staff-request-view/1')
    cy.interceptBusinessSlim().as('businessApiCall')
  })

  it('rendered expected visuals', () => {
    cy.fixture('request').then((testData) => {
      cy.fixture('requestComments').then((testDataComments) => {
        cy.intercept(
          'GET',
          '**/requests/**',
          testData
        )
        cy.intercept(
          'GET',
          '**/requests/**/comments',
          testDataComments
        )

        cy.get('[data-cy="staff-request-header"]')
          .should(
            'contain', 'Request to Omit Review'
          )

        cy.get('[data-cy="bizName-value"]').should('contain',
          '0871427 B.C. LTD.'
        )
        cy.get('[data-cy="corpNo-value"]').should('contain',
          'BC0871427'
        )
        cy.get('[data-cy="filingDate-value"]').should('contain',
          'October 11, 2024 at 7:15 AM Pacific Daylight Time'
        )

        cy.get('[data-cy="fullName-value"]').should('contain',
          'test'
        )
        cy.get('[data-cy="born-value"]').should('contain',
          'October 10, 2024'
        )
        cy.get('[data-cy="infoToOmit-value"]').should('contain',
          'full name, birth year'
        )
        cy.get('[data-cy="atRisk-value"]').should('contain',
          'Significant Individual & Members of the significant individual\'s household'
        )
        cy.get('[data-cy="reasons-value"]').should('contain',
          'reasons'
        )

        cy.get('[data-cy="cp-value"]').should('contain',
          'Representative'
        )
        cy.get('[data-cy="cpName-value"]').should('contain',
          'jane'
        )
        cy.get('[data-cy="email-value"]').should('contain',
          'jane@gmail.com'
        )
      })
    })
  })

  it('comment box works as expected', () => {
    cy.fixture('request').then((testData) => {
      cy.fixture('requestComments').then((testDataComments) => {
        cy.intercept(
          'GET',
          '**/requests/**',
          testData
        )
        cy.intercept(
          'GET',
          '**/requests/**/comments',
          testDataComments
        )

        let commentText = getString(100)
        cy.get('[data-cy="staff-comment-box"]').type(commentText, { delay: 0 })
        cy.get('[data-cy="staff-comment-box"]').should('have.value', commentText)

        commentText = getString(2000)
        cy.get('[data-cy="staff-comment-box"]').clear().type(commentText, { delay: 0 })
        cy.get('[data-cy="staff-comment-box"]').should('have.value', commentText)

        commentText = getString(2001)
        cy.get('[data-cy="staff-comment-box"]').clear().type(commentText, { delay: 0 })
        cy.get('[data-cy="staff-comment-box"]').should('not.have.value', commentText)
      })
    })
  })

  it('state select works as expected', () => {
    cy.fixture('request').then((testData) => {
      cy.fixture('requestComments').then((testDataComments) => {
        cy.intercept(
          'GET',
          '**/requests/**',
          testData
        )
        cy.intercept(
          'GET',
          '**/requests/**/comments',
          testDataComments
        )
        cy.intercept(
          'PUT',
          '**/requests/**'
        ).as('updateRequest')

        cy.get('[data-cy="stateSelect"]').should('contain', 'Info Requested')
        cy.get('[data-cy="stateSelect"]').select('Approved')
        cy.get('[data-cy="stateSelect"]').should('contain', 'Approved')

        cy.get('[data-cy="stateSelect"]').select('Rejected')
        cy.get('[data-cy="stateSelect"]').should('contain', 'Rejected')

        cy.get('[data-cy="stateSelect"]').select('Awaiting Review')
        cy.get('[data-cy="stateSelect"]').should('contain', 'Awaiting Review')

        cy.get('[data-cy="stateSelect"]').select('In Review')
        cy.get('[data-cy="stateSelect"]').should('contain', 'In Review')

        cy.get('[data-cy="stateSelect"]').select('Info Requested')
        cy.get('[data-cy="stateSelect"]').should('contain', 'Info Requested')

        cy.get('[data-cy="stateSelect"]').select('Under Appeal')
        cy.get('[data-cy="stateSelect"]').should('contain', 'Under Appea')

        cy.get('[data-cy="button-control-right-button"').eq(1).click()
        cy.wait(['@updateRequest'])
      })
    })
  })
})
