import { BodsInterestTypeE } from '../../../../enums/btr-bods-e'
import { dateToString } from '../../../../../btr-common-components/utils/date'

describe('pages -> Summary Table', () => {
  beforeEach(() => {
    cy.visitHomePageWithFakeData()
  })

  it('summary table headers are rendered', () => {
    const summaryTableHeaders = cy.get('[data-cy="individualsSummaryTable"]').get('th')
    summaryTableHeaders
      .should('contain', 'Name')
      .and('contain', 'Details')
      .and('contain', 'Significance Details')
      .and('contain', 'Effective Dates')
  })

  it('summary table body is rendered (existing SIs)', () => {
    cy.fixture('plotsEntityExistingSiResponse').then((siData: { payload }) => {
      // should only display records for current active SIs
      const viewableOwnrStmnts = siData.payload.ownershipOrControlStatements.filter(
        ownrStmnt => !!ownrStmnt.interests.find(interest => !interest.endDate))

      cy.get('[data-cy="individualsSummaryTable"]').as('summaryTable')
        .find('tbody').find('[data-cy="summary-table-row"]').as('summaryRow')
        .should('have.length', viewableOwnrStmnts.length)

      let unableToConfirmCount = 0
      for (const i in viewableOwnrStmnts) {
        const ownrStmnt = viewableOwnrStmnts[i]
        const personStmnt = siData.payload.personStatements.find(
          person => person.statementID === ownrStmnt.interestedParty.describedByPersonStatement)

        // name
        cy.get('@summaryRow').eq(Number(i)).find('[data-cy=summary-table-name]').as('nameItem')
          .should('contain.text', personStmnt?.names[0].fullName)
        // badge
        cy.get('@nameItem').find('[data-cy="name-badge"]').should('not.exist')
        // citizenship
        for (const country of personStmnt?.nationalities || []) {
          cy.get('@nameItem').find(`.f-${country.code.toLowerCase()}`).should('exist')
        }

        cy.get('@summaryRow').find('[data-cy=summary-table-details]').as('detailsItem')

        // address
        if (personStmnt?.addresses?.length) {
          const address = personStmnt?.addresses[0]
          cy.get('@detailsItem')
            .should('contain.text', address?.street)
            .should('contain.text', address?.city)
            .should('contain.text', address?.region)
            .should('contain.text', address?.countryName)
            .should('contain.text', address?.postalCode)
            .should('contain.text', address?.locationDescription)
        }
        // tax number
        if (personStmnt?.hasTaxNumber) {
          cy.get('@detailsItem').should('contain.text', personStmnt?.identifiers[0].id)
        }
        // tax residency
        if (personStmnt?.taxResidencies?.length) {
          cy.get('@detailsItem').should('contain.text', personStmnt?.taxResidencies[0].name)
        }
        // email
        if (personStmnt?.email) {
          cy.get('@detailsItem').should('contain.text', personStmnt?.email)
        }
        // phone
        if (personStmnt?.phoneNumber?.number) {
          cy.get('@detailsItem').should('contain.text', personStmnt?.phoneNumber?.number)
        }
        // interests / dates
        cy.get('@summaryRow')
          .find('[data-cy=summary-table-controls]').as('controlItem')
          .should('exist')
        cy.get('@summaryRow')
          .find('[data-cy=summary-table-dates]').as('datesItem')
          .should('exist')

        for (const interest of ownrStmnt.interests) {
          // control
          switch (interest.details) {
            case BodsInterestTypeE.APPOINTMENT_OF_BOARD:
              cy.get('@controlItem').should('contain.text', 'Directors')
              break
            case BodsInterestTypeE.SHAREHOLDING:
              cy.get('@controlItem').should('contain.text', 'Shares')
              break
            case BodsInterestTypeE.VOTING_RIGHTS:
              cy.get('@controlItem').should('contain.text', 'Votes')
              break
            case BodsInterestTypeE.OTHER_INFLUENCE_OR_CONTROL:
              cy.get('@controlItem').should('contain.text', 'Other')
          }
          // effective dates
          cy.get('@datesItem').should('contain.text', interest.startDate || 'Unknown')
          cy.get('@datesItem').should('contain.text', interest.endDate || 'Current')
        }
        // action buttons
        cy.get('@summaryRow').find('[data-cy=summary-table-buttons]').should('contain.text', 'Update')
        // unable to obtain information row
        if (personStmnt?.missingInfoReason) {
          cy.testMissingInfoRow(unableToConfirmCount, personStmnt.missingInfoReason)
          // NOTE: not every record will include this row so need can't use the summary row index
          unableToConfirmCount += 1
        }
      }
    })
  })

  it('summary table body is rendered (new SI)', () => {
    cy.addTestIndividuals()

    cy.fixture('individuals').then((testData) => {
      const today = new Date()
      const expectedDate = dateToString(today, 'YYYY-MM-DD')

      // check if the summary table contains` the correct data
      cy.get('[data-cy="individualsSummaryTable"]')
        .get('[data-cy=summary-table-name]').contains(testData.profile1.fullName)
        .get('[data-cy=summary-table-name]').contains(testData.profile1.preferredName)
        .get('[data-cy=summary-table-details]').contains(testData.profile1.email)
        .get('[data-cy=summary-table-details]').contains(testData.profile1.address.streetAddress)
        .get('[data-cy=summary-table-details]').contains(testData.profile1.address.city)
        .get('[data-cy=summary-table-details]').contains(testData.profile1.address.province[1])
        .get('[data-cy=summary-table-details]').contains(testData.profile1.address.postalCode)
        .get('[data-cy=summary-table-details]').contains(testData.profile1.address.country)
        .get('[data-cy=summary-table-details]').contains(testData.profile1.taxNumber)
        // .get('[data-cy=summary-table-details]').contains(testData.profile1.summaryTable.citizenship)
        .get('[data-cy=summary-table-details]').contains(testData.profile1.summaryTable.taxResidency)
        // todo: fixme: update on #TBD with new summary table
        // .get('[data-cy=summary-table-controls]').contains(testData.profile1.summaryTable.shareControl)
        // todo: fixme: update on #20756
        // .get('[data-cy=summary-table-controls]').contains(testData.profile1.summaryTable.directorControl)
        .get('[data-cy=summary-table-dates]').contains(expectedDate)
        .get('[data-cy=summary-table-name]').contains(testData.profile2.fullName)
        .get('[data-cy=summary-table-name]').contains(testData.profile2.preferredName)
        .get('[data-cy=summary-table-details]').contains(testData.profile2.email)
        .get('[data-cy=summary-table-details]').contains(testData.profile2.address.streetAddress)
        .get('[data-cy=summary-table-details]').contains(testData.profile2.address.city)
        .get('[data-cy=summary-table-details]').contains(testData.profile2.address.province[1])
        .get('[data-cy=summary-table-details]').contains(testData.profile2.address.postalCode)
        .get('[data-cy=summary-table-details]').contains(testData.profile2.address.country)
        .get('[data-cy=summary-table-details]').contains(testData.profile2.taxNumber)
        // .get('[data-cy=summary-table-details]').contains(testData.profile2.summaryTable.citizenship)
        .get('[data-cy=summary-table-details]').contains(testData.profile2.summaryTable.taxResidency)
      // todo: fixme: update on #TBD with new summary table
      // .get('[data-cy=summary-table-controls]').contains(testData.profile2.summaryTable.shareControl)
      // .get('[data-cy=summary-table-controls]').contains(testData.profile2.summaryTable.directorControl)
    })
  })

  it('test the action buttons (existing SIs)', () => {
    cy.get('[data-cy="individualsSummaryTable"]').as('summaryTable')
      .find('[data-cy="summary-table-row"]').as('summaryRow').should('exist')
    cy.get('@summaryRow').first().find('[data-cy=action-button]').as('firstUpdateBtn')
      .should('have.text', 'Update')
      .should('not.have.attr', 'disabled')
    // edit SI is not open
    cy.get('@summaryTable').find('[data-cy="summary-table-row-edit"]').should('not.exist')

    // Click the first update button to start editing the first significant individual profile
    cy.get('@firstUpdateBtn').click()

    // After the button click, the edit form is displayed, the other edit button is disabled,
    // and the "Add an Individual" button is disabled
    cy.get('@firstUpdateBtn').should('have.attr', 'disabled')
    cy.get('@summaryTable').find('[data-cy="summary-table-row-edit"]').as('summaryEdit').should('exist')
    cy.get('[data-cy=add-new-btn]').should('have.attr', 'disabled')

    // update citizenships
    cy.get('[data-cy="citizenships.otherComboboxButton"]').click()
    // select bangladesh
    cy.get('[id^="headlessui-combobox-options"]').find('li').eq(18).click({ force: true })
    // click 'Done'
    cy.get('[data-cy=new-si-done-btn]').click()
    // should trigger 'updating' row for 1 second
    cy.get('@summaryTable').find('[data-cy="summary-table-row-updating"]')
      .should('exist')
      .should('have.length', 1)
      .as('rowsUpdating')
    cy.wait(1000)
    cy.get('@rowsUpdating').should('not.exist')
    // should have 'updated' badge / undo option / changes
    cy.get('@summaryRow').first().find('[data-cy=summary-table-name]').as('nameItem')
      .find('[data-cy="name-badge"]')
      .should('contain.text', 'UPDATED')
    // bangladesh should be there
    cy.get('@nameItem').find('.f-bd').should('exist')
    cy.get('@summaryRow').first().find('[data-cy=summary-table-buttons]').as('summaryActions')
      .find('[data-cy=action-button]').as('actionButton')
      .should('contain.text', 'Undo')
    // click undo
    cy.get('@actionButton').click()
    // should trigger 'updating' row for 1 second
    cy.get('@summaryTable').find('[data-cy="summary-table-row-updating"]')
      .should('exist')
      .should('have.length', 1)
      .as('rowsUpdating')
    cy.wait(1000)
    cy.get('@rowsUpdating').should('not.exist')
    // verify changes are undone
    cy.get('@nameItem').find('[data-cy="name-badge"]').should('not.exist')
    cy.get('@nameItem').find('.f-bd').should('not.exist')
    cy.get('@actionButton').should('contain.text', 'Update')
    cy.get('@summaryTable').find('[data-cy="summary-table-row-cease"]').should('not.exist')

    // 'cease' verification
    cy.get('@summaryRow').first().find('[data-cy=summary-table-dates]').as('datesItem')
      .should('contain.text', 'Current')
    cy.get('@summaryActions').find('[data-cy="popover-button"]').click()
    cy.get('@summaryActions').find('[data-cy="popover-action-button"]')
      .should('exist')
      .should('have.text', 'Cease')
      .click()
    // verify cease component row
    cy.get('@summaryTable').find('[data-cy="summary-table-row-cease"]').as('cessationSelect')
      .should('exist')
      .find('[data-cy="date-select"]').as('dateSelect')
      .should('exist')
    // set cessation date
    cy.get('@dateSelect').click()
    cy.get('@cessationSelect')
      .find('[data-cy=date-picker]')
      .find('.bcros-date-picker__calendar__day.dp__today')
      .trigger('click')
    cy.get('@cessationSelect').find('[data-cy=cease-done]').click()
    // should trigger 'updating' row for 1 second
    cy.get('@summaryTable').find('[data-cy="summary-table-row-updating"]')
      .should('exist')
      .should('have.length', 1)
      .as('rowsUpdating')
    cy.wait(1000)
    cy.get('@rowsUpdating').should('not.exist')
    // verify 'cease' badge / opacity
    cy.get('@cessationSelect').should('not.exist')
    cy.get('@nameItem').find('[data-cy="name-badge"]')
      .should('contain.text', 'UPDATED')
      .should('contain.text', 'CEASED')
    cy.get('@nameItem').find('.opacity-55').should('exist')
    cy.get('@datesItem').should('not.contain.text', 'Current')
    cy.get('@actionButton').should('contain.text', 'Undo')
    // click undo
    cy.get('@actionButton').click()
    // should trigger 'updating' row for 1 second
    cy.get('@summaryTable').find('[data-cy="summary-table-row-updating"]')
      .should('exist')
      .should('have.length', 1)
      .as('rowsUpdating')
    cy.wait(1000)
    cy.get('@rowsUpdating').should('not.exist')
    // verify cease is undone
    cy.get('@nameItem').find('[data-cy="name-badge"]').should('not.exist')
    cy.get('@nameItem').find('.opacity-55').should('not.exist')
    cy.get('@datesItem').should('contain.text', 'Current')
    cy.get('@actionButton').should('contain.text', 'Update')
  })

  it('test the action buttons (new SIs)', () => {
    cy.get('[data-cy="individualsSummaryTable"]').as('summaryTable')
      .find('[data-cy="summary-table-row"]').as('summaryRow')
      .should('exist')
      .should('have.length', 4)

    cy.addTestIndividuals(false)
    // should trigger 'updating' on all rows for 1 second
    cy.get('@summaryTable').find('[data-cy="summary-table-row-updating"]')
      .should('exist')
      .should('have.length', 5)
      .as('rowsUpdating')
    cy.wait(1000)
    cy.get('@rowsUpdating').should('not.exist')

    cy.get('@summaryRow').should('have.length', 5)

    cy.fixture('individuals').then((testData) => {
      cy.get('@summaryRow').first().find('[data-cy=summary-table-name]').as('nameItem')
        .should('contain.text', testData.profile1.fullName)
      // should have 'new' badge / edit option / remove
      cy.get('@summaryRow').first().find('[data-cy=summary-table-name]').as('nameItem')
        .find('[data-cy="name-badge"]')
        .should('contain.text', 'NEW')
      cy.get('@summaryRow').first().find('[data-cy=action-button]').as('actionButton')
        .should('have.text', 'Edit')
        .should('not.have.attr', 'disabled')
      // edit SI is not open
      cy.get('@summaryTable').find('[data-cy="summary-table-row-edit"]').should('not.exist')

      // Click the action button to start editing the first significant individual profile
      cy.get('@actionButton').click()

      // After the button click, the edit form is displayed, the other edit button is disabled,
      // and the "Add an Individual" button is disabled
      cy.get('@actionButton').should('have.attr', 'disabled')
      cy.get('@summaryTable').find('[data-cy="summary-table-row-edit"]').as('summaryEdit').should('exist')
      cy.get('[data-cy=add-new-btn]').should('have.attr', 'disabled')
      // click 'Done'
      cy.get('[data-cy=new-si-done-btn]').click()
      // should trigger 'updating' row for 1 second
      cy.get('@summaryTable').find('[data-cy="summary-table-row-updating"]')
        .should('exist')
        .should('have.length', 1)
        .as('rowsUpdating')
      cy.wait(1000)
      cy.get('@rowsUpdating').should('not.exist')
      cy.get('@summaryTable').find('[data-cy="summary-table-row-edit"]').should('not.exist')

      // click 'remove'
      cy.get('@summaryRow').first().find('[data-cy=summary-table-buttons]').as('summaryActions')
        .find('[data-cy="popover-button"]').click()
      cy.get('@summaryActions').find('[data-cy="popover-action-button"]')
        .should('exist')
        .should('have.text', 'Remove')
        .click()
      // should trigger 'updating' row for 1 second
      cy.get('@summaryTable').find('[data-cy="summary-table-row-updating"]')
        .should('exist')
        .should('have.length', 4)
        .as('rowsUpdating')
      cy.wait(1000)
      cy.get('@rowsUpdating').should('not.exist')
      // verify removal
      cy.get('@summaryRow').should('have.length', 4)
      cy.get('@nameItem').should('not.contain.text', testData.profile1.fullName)
      cy.get('@nameItem').find('[data-cy="name-badge"]').should('not.exist')
      cy.get('@actionButton').should('contain.text', 'Update')
    })
  })

  it('test two ways to remove citizenship in the edit form', () => {
    cy.fixture('individuals').then((testData) => {
      cy.addSingleTestSi(testData.profile3)
    })

    // open the edit form for the first SI and ensure it has one citizenship selected,
    // remove the citizenship by clicking on the selected item in the dropdown, and the SI should have no citizenship
    cy.get('[data-cy=action-button]').eq(0).click()
    cy.get('[data-cy="citizenships.otherComboboxChip"]').should('have.length', 1)
    cy.get('[data-cy="citizenships.otherComboboxButton"]').click()
    cy.get('[id^="headlessui-combobox-options"]').find('li').first().click({ force: true })
    cy.get('[data-cy="citizenships.otherComboboxChip"]').should('have.length', 0)
    cy.get('[data-cy=new-si-cancel-btn]').click()
    // open the edit form for the second SI and ensure it has one citizenship selected,
    // remove the citizenship by clicking on the selected citizenship tag, and the SI should have no citizenship
    cy.get('[data-cy=action-button]').eq(0).click()
    cy.get('[data-cy="citizenships.otherComboboxChip"]').should('have.length', 1)
    cy.get('[data-cy="citizenships.otherComboboxChip"]').eq(0).find('[data-cy="close-icon"]').click()
    cy.get('[data-cy="citizenships.otherComboboxChip"]').should('have.length', 0)
  })

  it('the edit form contains all information in the profile', () => {
    const today = new Date()
    const expectedDate = dateToString(today, 'YYYY-MM-DD')

    cy.fixture('individuals').then((testData) => {
      cy.addSingleTestSi(testData.profile3)

      cy.get('[data-cy=action-button]').first().click()

      // currently any test SI added is added with date today so they will have minior warning
      cy.get('[data-cy="summary-table-row-minor-alert"]').should('exist')

      cy.get('#individual-person-full-name').should('have.value', testData.profile3.fullName)
      cy.get('#individual-person-preferred-name').should('have.value', testData.profile3.preferredName)
      cy.get('#individual-person-email').should('have.value', testData.profile3.email)
      // todo: fixme update with #TBD
      // .get('input[name="percentOfShares[range]"]').invoke('val').should('eq', testData.profile3.percentOfShares)
      // .get('input[name="percentOfShares[range]"]').invoke('val').should('eq', testData.profile3.percentOfVotes)
      // todo: fixme update with #20756
      // .get('[data-cy="testTypeOfControl"]').get('[name="registeredOwner"]').should('be.checked')
      // .get('[data-cy="testControlOfDirectors"]').get('[name="directControl"]').should('be.checked')
      // todo: fix on #TBD (summary table ticket)
      // .get('[data-cy=date-select]').should('have.value', expectedDate)
      cy.get('[data-cy="start-date-select"]').find('input').should('have.value', expectedDate)
      cy.get('[data-cy="address-country"]').contains(testData.profile3.address.country)
      cy.get('[data-cy="address-line1-autocomplete"] input')
        .should('have.value', testData.profile3.address.streetAddress)
      cy.get('[data-cy="address-city"]').should('have.value', testData.profile3.address.city)
      cy.get('[data-cy="address-region-select"]').contains(testData.profile3.address.province[0])
      cy.get('[data-cy="address-postal-code"]').should('have.value', testData.profile3.address.postalCode)
      cy.get('[data-cy="citizenships.otherComboboxButton"]').contains(testData.profile3.citizenships[0].name)
    })
  })

  it('test the CANCEL button in the Edit form', () => {
    cy.fixture('individuals').then((testData) => {
      cy.addTestIndividuals()

      cy.get('[data-cy=summary-table-name]').contains(testData.profile1.fullName)

      cy.get('[data-cy=action-button]').first().click()

      // When CANCEL button is clicked, the profile will not be changed
      cy.get('#individual-person-full-name').clear().type('NEW NAME')
      cy.get('[data-cy=new-si-cancel-btn]').click()
      cy.get('[data-cy=summary-table-name]').contains(testData.profile1.fullName)
      cy.get('[data-cy=summary-table-name]').should('not.contain', 'NEW NAME')

      // the edit form will be closed
      cy.get('[data-cy=individualsSummaryTable]').should('not.contain', 'Editing')

      // the edit buttons will be enabled
      cy.get('[data-cy=action-button]').eq(0).should('not.have.attr', 'disabled')
      cy.get('[data-cy=action-button]').eq(1).should('not.have.attr', 'disabled')

      // the "Add an Individual" button will be enabled
      cy.get('[data-cy=add-new-btn]').should('not.have.attr', 'disabled')
    })
  })

  it('test the DONE button in the Edit form', () => {
    cy.addTestIndividuals()

    cy.get('[data-cy=summary-table-name]').first().invoke('text').then((textOrig) => {
      cy.get('[data-cy=action-button]').first().click()

      const textEntered = 'NEW NAME'
      cy.get('#individual-person-full-name').clear().type(textEntered)
      cy.get('[data-cy=new-si-done-btn]').click()
      cy.wait(5000)
      cy.get('[data-cy=summary-table-name]').first().invoke('text').should((textNew) => {
        expect(textNew).to.contain(textEntered)
        expect(textOrig).not.to.contain(textNew)
      })
    })

    cy.get('[data-cy=individualsSummaryTable]').should('not.contain', 'Editing')
    cy.get('[data-cy=action-button]').eq(0).should('not.have.attr', 'disabled')
    cy.get('[data-cy=action-button]').eq(1).should('not.have.attr', 'disabled')
    cy.get('[data-cy=add-new-btn]').should('not.have.attr', 'disabled')
  })

  it('test the REMOVE button in the Edit form', () => {
    // remove all significant individuals from the table
    cy.get('[data-cy=action-button]').then((buttons) => {
      for (let i = 0; i < buttons.length; i++) {
        cy.get('[data-cy=action-button]').first().click()
        cy.get('[data-cy=edit-si-remove-btn]').click()
      }
    })

    cy.get('[data-cy="individualsSummaryTable"]').get('td')
      .should('contain.text', 'You have no Significant individuals listed')
  })

  it('Editing should be disabled when the user is adding a new SI', () => {
    cy.get('[data-cy=add-new-btn]').click()
    cy.get('[data-cy=action-button]').then((buttons) => {
      for (let i = 0; i < buttons.length; i++) {
        cy.get('[data-cy=action-button]').first().should('have.attr', 'disabled')
      }
    })
    cy.get('[data-cy=new-si-cancel-btn]').click()
    cy.get('[data-cy=action-button]').then((buttons) => {
      for (let i = 0; i < buttons.length; i++) {
        cy.get('[data-cy=action-button]').first().should('not.have.attr', 'disabled')
      }
    })
  })
})
