import { SI_EXAMPLE_DATE } from '~/tests/utils/mockedData'

export const OwnershipOrControlStatements = {
  ownershipOrControlStatements: [
    {
      statementID: '50f92ffb-adeb-491e-bbfe-5ac2470f124c',
      interestedParty: {
        describedByPersonStatement: 'db102217-429c-439e-9075-13c4e84fbb4d'
      },
      interests: [
        {
          type: 'appointmentOfBoard',
          directOrIndirect: 'direct',
          details: 'controlType.directors.directControl',
          startDate: SI_EXAMPLE_DATE,
          endDate: undefined
        },
        {
          type: 'appointmentOfBoard',
          directOrIndirect: 'indirect',
          details: 'controlType.directors.indirectControl',
          startDate: SI_EXAMPLE_DATE,
          endDate: undefined
        },
        {
          directOrIndirect: 'direct',
          details: 'controlType.sharesOrVotes.registeredOwner',
          startDate: SI_EXAMPLE_DATE,
          endDate: undefined,
          share: {
            exclusiveMaximum: false,
            exclusiveMinimum: false,
            maximum: 50,
            minimum: 25
          },
          type: 'votingRights'
        },
        {
          directOrIndirect: 'direct',
          details: 'controlType.sharesOrVotes.registeredOwner',
          startDate: SI_EXAMPLE_DATE,
          endDate: undefined,
          share: {
            exclusiveMaximum: false,
            exclusiveMinimum: true,
            maximum: 75,
            minimum: 50
          },
          type: 'shareholding'
        }
      ],
      isComponent: false,
      publicationDetails: {
        bodsVersion: '0.3',
        publicationDate: '2024-01-26',
        publisher: {
          name: 'BCROS - BC Registries and Online Services',
          url: 'https://www.bcregistry.gov.bc.ca/'
        }
      },
      source: {
        description: 'Using Gov BC - BTR - Web UI',
        type: ['selfDeclaration'],
        assertedBy: [{ name: 'Test Name' }]
      },
      statementDate: SI_EXAMPLE_DATE,
      statementType: 'ownershipOrControlStatement',
      subject: { describedByEntityStatement: '' }
    }
  ],
  personStatements: [
    {
      placeOfResidence: {
        city: 'Victoria',
        country: 'CA',
        countryName: 'Canada',
        street: '1234 test street',
        postalCode: 'V1A 2B3',
        region: 'BC',
        streetAdditional: '',
        locationDescription: ''
      },
      addresses: [
        {
          city: 'Victoria',
          country: 'CA',
          countryName: 'Canada',
          street: '1234 test street',
          postalCode: 'V1A 2B3',
          region: 'BC',
          streetAdditional: '',
          locationDescription: ''
        }
      ],
      birthDate: '2000-03-19',
      email: '1@1.com',
      externalInfluence: 'CanInfluence',
      hasTaxNumber: true,
      identifiers: [{ id: '000 000 000', scheme: 'CAN-TAXID', schemeName: 'ITN' }],
      isComponent: false,
      missingInfoReason: '',
      names: [
        { fullName: 'Test Name', type: 'individual' },
        { fullName: 'Waffles Test', type: 'alternative' }
      ],
      nationalities: [{ name: 'Canada', code: 'CA' }],
      isPermanentResidentCa: false,
      personType: 'knownPerson',
      publicationDetails: {
        bodsVersion: '0.3',
        publicationDate: '2024-01-26',
        publisher: {
          name: 'BCROS - BC Registries and Online Services',
          url: 'https://www.bcregistry.gov.bc.ca/'
        }
      },
      source: {
        description: 'Using Gov BC - BTR - Web UI',
        type: ['selfDeclaration'],
        assertedBy: [{ name: 'Test Name' }]
      },
      statementDate: SI_EXAMPLE_DATE,
      statementType: 'personStatement',
      taxResidencies: [{ name: 'Canada', code: 'CA' }],
      statementID: 'db102217-429c-439e-9075-13c4e84fbb4d'
    }
  ]
}
