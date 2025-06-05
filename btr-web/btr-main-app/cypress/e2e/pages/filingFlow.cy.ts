import { SubmissionTypeE } from '../../../enums/submission-type-e'

describe('Filing Flow', () => {
  it('Initial Filing', () => {
    cy.visitHomePageWithFakeData('BC0871427', SubmissionTypeE.INITIAL_FILING, undefined, true)

    cy.get('[data-cy="pay-fees-widget-empty-fees"]')
      .should('have.text', 'Transparency Register Filing - ')

    cy.get('[data-cy=button-control-right-button]').eq(0).click()
    cy.get('[data-cy=info-section]')
      .should('contain', 'You have to make a selection OR add a Significant Individual in order to continue')

    // check the 'No Significant Individuals' checkbox to remove the error
    cy.get('[data-cy=noSignificantIndividualsExist-checkbox]').check()

    cy.get('[data-cy=button-control-right-button]').eq(0).click()
    cy.url().should('include', '/review-confirm')
  })

  it('Initial Annual Filing', () => {
    cy.visitHomePageWithFakeData('BC0871427', SubmissionTypeE.ANNUAL_FILING, '2025', true)
    // check page title
    cy.get('[data-cy="page-header"]').should('have.text', 'File Transparency Register - Annual Filing 2025')

    // the no-Change checkbox does not exist
    cy.get('[data-cy="annualFilingNoChanges-section"]').should('not.exist')
  })

  it('Subsequent Annual Filing - update existing SI', () => {
    cy.visitHomePageWithFakeData('BC0871427', SubmissionTypeE.ANNUAL_FILING, '2027', false)

    // check page title
    cy.get('[data-cy="page-header"]').should('have.text', 'File Transparency Register - Annual Filing 2027')

    // check fee summary widget (empty state)
    cy.get('[data-cy="pay-fees-widget-empty-fees"]')
      .should('have.text', 'Transparency Register Annual Filing 2027 - ')

    // the no-Change checkbox should exist
    cy.get('[data-cy="annualFilingNoChanges-section"]')
      .should('contain', 'There are no changes to the company transparency register information')
    cy.get('[data-cy="annualFilingNoChanges-checkbox"]').should('exist')

    // clicking the 'Review and Confirm' button should raise an error
    cy.get('[data-cy=button-control-right-button]').eq(0).click()
    cy.get('[data-cy=info-section]')
      .should('contain', 'You have to make a selection OR edit the page in order to continue')

    // update SI; no-Change checkbox should be disabled while the SI is being updated
    cy.get('[data-cy="action-button"]').first().click()
    cy.get('input[data-cy="testFullName"]').focus()
    cy.get('input[data-cy="testFullName"]').type(' 123')
    cy.get('input[data-cy="name-change-reason-radio-other"]').first().check()

    // clear the description modal
    cy.get('[data-cy="declaration-modal-button-confirm"]').click()

    cy.get('[data-cy="annualFilingNoChanges-checkbox"]').should('be.disabled')
    cy.get('button[data-cy=new-si-done-btn]').focus().click()

    // check fee summary widget
    cy.get('[data-cy="fee-item-0"]')
      .should('contain', 'Transparency Register Annual Filing 2027')
      .should('contain', 'No Fee')

    // now we can continue to the Review and Confirm page
    cy.get('[data-cy=button-control-right-button]').eq(0).click()
    cy.url().should('include', '/review-confirm')
  })

  it('Subsequent Annual Filing - no change to SI information', () => {
    cy.visitHomePageWithFakeData('BC0871427', SubmissionTypeE.ANNUAL_FILING, '2027', false)
    // clicking the 'Review and Confirm' button should raise an error
    cy.get('[data-cy=button-control-right-button]').eq(0).click()
    cy.get('[data-cy=info-section]')
      .should('contain', 'You have to make a selection OR edit the page in order to continue')

    // check the 'No Changes' checkbox to remove the error
    cy.get('[data-cy=annualFilingNoChanges-checkbox]').check()
    cy.get('[data-cy=info-section]')
      .should('not.contain', 'You have to make a selection OR edit the page in order to continue')

    // verify the Add-New button is disabled
    cy.get('[data-cy=add-new-btn]').should('be.disabled')

    // all buttons in the summary table should be disabled
    cy.get('[data-cy=action-button]').should('be.disabled')

    // dropdowns in control table should be disabled
    cy.get('[id^="headlessui-combobox-button-"]')
      .each((combobox) => {
        cy.wrap(combobox).should('have.attr', 'data-headlessui-state', 'disabled')
      })

    // move to the Review and Confirm page and verify the alert message.
    cy.get('[data-cy=button-control-right-button]').eq(0).click()
    cy.url().should('include', '/review-confirm')
    cy.get('[data-cy=review-confirm-alert]')
      .should('contain', 'You are indicating there are no changes to the company’s transparency register information.')
      .should('contain', 'This information needs to match what is in the company’s internal transparency register.')
  })

  it('Change Filing', () => {
    cy.visitHomePageWithFakeData('BC0871427', SubmissionTypeE.CHANGE_FILING, undefined, false)

    cy.get('[data-cy=button-control-right-button]').eq(0).click()
    cy.get('[data-cy=info-section]')
      .should('contain', 'You have to make an edit to the page in order to continue')

    cy.get('[data-cy="pay-fees-widget-empty-fees"]')
      .should('have.text', 'Transparency Register Filing - ')
  })
})
