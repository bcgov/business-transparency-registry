import business from '../../fixtures/business.json'
import contact from '../../fixtures/businessContact.json'

describe('Layout -> Business Details', () => {
  it('shows correct values in business layout (BEN)', () => {
    // setup intercepts
    cy.intercept(
      'GET',
      `https://legal-api-dev.apps.silver.devops.gov.bc.ca/api/v2/businesses/${business.identifier}?slim=true`,
      { business })
    cy.intercept(
      'GET',
      `https://auth-api-dev.apps.silver.devops.gov.bc.ca/api/v1/entities/${business.identifier}`,
      contact)
    cy.visit(`/${business.identifier}/beneficial-owner-change`)
    cy.wait(1000)
    cy.get('#bcros-business-details').should('exist')
    cy.get('[data-cy=business-details-name]').should('contain.text', business.legalName)
    cy.get('[data-cy=business-details-name]').should('contain.text', 'BC Benefit Company')
    cy.get('[data-cy=business-details-info]').get('dt').should('have.length', 4)
    cy.get('[data-cy=business-details-info]').get('dd').should('have.length', 4)
    cy.get('[data-cy=business-details-info]').get('dt').eq(0).should('contain.text', 'Business Number')
    cy.get('[data-cy=business-details-info]').get('dd').eq(0).should('contain.text', business.taxId)
    cy.get('[data-cy=business-details-info]').get('dt').eq(1).should('contain.text', 'Incorporation Number')
    cy.get('[data-cy=business-details-info]').get('dd').eq(1).should('contain.text', business.identifier)
    cy.get('[data-cy=business-details-info]').get('dt').eq(2).should('contain.text', 'Email')
    cy.get('[data-cy=business-details-info]').get('dd').eq(2).should('contain.text', contact.contacts[0].email)
    cy.get('[data-cy=business-details-info]').get('dt').eq(3).should('contain.text', 'Phone')
    cy.get('[data-cy=business-details-info]').get('dd').eq(3).should('contain.text', contact.contacts[0].phone)
  })

  it('shows correct values in business layout (CP)', () => {
    const businessCP = { ...business }
    businessCP.identifier = 'CP1234567'
    businessCP.legalType = 'CP'
    // setup intercepts
    cy.intercept(
      'GET',
      `https://legal-api-dev.apps.silver.devops.gov.bc.ca/api/v2/businesses/${businessCP.identifier}?slim=true`,
      { business: businessCP })
    cy.intercept(
      'GET',
      `https://auth-api-dev.apps.silver.devops.gov.bc.ca/api/v1/entities/${businessCP.identifier}`,
      contact)
    cy.visit(`/${businessCP.identifier}/beneficial-owner-change`)
    cy.wait(1000)
    cy.get('[data-cy=business-details-name]').should('contain.text', 'BC Cooperative Association')
    cy.get('[data-cy=business-details-info]').get('dt').eq(1).should('contain.text', 'Incorporation Number')
    cy.get('[data-cy=business-details-info]').get('dd').eq(1).should('contain.text', businessCP.identifier)
  })

  it('shows correct values in business layout (SP)', () => {
    const businessSP = { ...business }
    businessSP.identifier = 'FM1234567'
    businessSP.legalType = 'SP'
    // setup intercepts
    cy.intercept(
      'GET',
      `https://legal-api-dev.apps.silver.devops.gov.bc.ca/api/v2/businesses/${businessSP.identifier}?slim=true`,
      { business: businessSP })
    cy.intercept(
      'GET',
      `https://auth-api-dev.apps.silver.devops.gov.bc.ca/api/v1/entities/${businessSP.identifier}`,
      contact)
    cy.visit(`/${businessSP.identifier}/beneficial-owner-change`)
    cy.wait(1000)
    cy.get('[data-cy=business-details-name]').should('contain.text', 'Sole Proprietorship')
    cy.get('[data-cy=business-details-info]').get('dt').eq(1).should('contain.text', 'Registration Number')
    cy.get('[data-cy=business-details-info]').get('dd').eq(1).should('contain.text', businessSP.identifier)
  })

  it('shows correct values in business layout (GP)', () => {
    const businessGP = { ...business }
    businessGP.identifier = 'FM1234568'
    businessGP.legalType = 'GP'
    // setup intercepts
    cy.intercept(
      'GET',
      `https://legal-api-dev.apps.silver.devops.gov.bc.ca/api/v2/businesses/${businessGP.identifier}?slim=true`,
      { business: businessGP })
    cy.intercept(
      'GET',
      `https://auth-api-dev.apps.silver.devops.gov.bc.ca/api/v1/entities/${businessGP.identifier}`,
      contact)
    cy.visit(`/${businessGP.identifier}/beneficial-owner-change`)
    cy.wait(1000)
    cy.get('[data-cy=business-details-name]').should('contain.text', 'BC General Partnership')
    cy.get('[data-cy=business-details-info]').get('dt').eq(1).should('contain.text', 'Registration Number')
    cy.get('[data-cy=business-details-info]').get('dd').eq(1).should('contain.text', businessGP.identifier)
  })
})
