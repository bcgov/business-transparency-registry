import { SiSchemaType } from '~/utils/si-schema/definitions'

export const btrSubmissionExampleMock = {
  business_identifier: 'BC0871427',
  effective_date: '2024-01-04',
  id: 15,
  payload: {
    businessIdentifier: 'BC0871427',
    effectiveDate: '2024-01-04',
    entityStatement: {
      entityType: 'legalEntity',
      identifiers: [],
      isComponent: false,
      name: '0871427 B.C. LTD.',
      publicationDetails: {
        bodsVersion: '0.3',
        publicationDate: '2024-01-30',
        publisher: {
          name: 'BCROS - BC Registries and Online Services',
          url: 'https://www.bcregistry.gov.bc.ca/'
        }
      },
      source: {
        assertedBy: [
          {
            name: 'BCROS - BC Registries and Online Services',
            uri: 'https://www.bcregistry.gov.bc.ca/'
          }
        ],
        retrievedAt: '2024-01-30T17:57:52.557Z',
        type: [
          'officialRegister',
          'verified'
        ]
      },
      statementDate: '2024-01-30',
      statementID: '62c1097a-6a62-48ad-8a58-e0a09f07b01c',
      statementType: 'entityStatement'
    },
    ownershipOrControlStatements: [
      {
        interestedParty: {
          describedByPersonStatement: 'b0882814-34e2-42e9-b065-a550d94c9df1'
        },
        interests: [
          {
            details: 'controlType.directors.directControl',
            directOrIndirect: 'direct',
            startDate: '2024-01-04',
            type: 'appointmentOfBoard'
          },
          {
            details: 'controlType.directors.inConcertControl',
            directOrIndirect: 'indirect',
            startDate: '2024-01-04',
            type: 'appointmentOfBoard'
          },
          {
            details: 'controlType.directors.indirectControl',
            directOrIndirect: 'indirect',
            startDate: '2024-01-04',
            type: 'appointmentOfBoard'
          },
          {
            details: 'controlType.directors.significantInfluence',
            directOrIndirect: 'unknown',
            startDate: '2024-01-04',
            type: 'appointmentOfBoard'
          },
          {
            details: 'controlType.shares.registeredOwner',
            directOrIndirect: 'direct',
            share: {
              exclusiveMaximum: false,
              exclusiveMinimum: false,
              maximum: 50,
              minimum: 25
            },
            startDate: '2024-01-04',
            type: 'shareholding'
          },
          {
            details: 'controlType.shares.indirectControl',
            directOrIndirect: 'indirect',
            share: {
              exclusiveMaximum: false,
              exclusiveMinimum: false,
              maximum: 50,
              minimum: 25
            },
            startDate: '2024-01-04',
            type: 'shareholding'
          },
          {
            details: 'controlType.shares.inConcertControl',
            directOrIndirect: 'indirect',
            share: {
              exclusiveMaximum: false,
              exclusiveMinimum: false,
              maximum: 50,
              minimum: 25
            },
            startDate: '2024-01-04',
            type: 'shareholding'
          },
          {
            details: 'controlType.shares.beneficialOwner',
            directOrIndirect: 'indirect',
            share: {
              exclusiveMaximum: false,
              exclusiveMinimum: false,
              maximum: 50,
              minimum: 25
            },
            startDate: '2024-01-04',
            type: 'shareholding'
          },
          {
            details: 'everything',
            type: 'otherInfluenceOrControl'
          }
        ],
        isComponent: false,
        publicationDetails: {
          bodsVersion: '0.3',
          publicationDate: '2024-01-30',
          publisher: {
            name: 'BCROS - BC Registries and Online Services',
            url: 'https://www.bcregistry.gov.bc.ca/'
          }
        },
        source: {
          assertedBy: [
            {
              name: 'Hrvoje Fekete'
            }
          ],
          description: 'Using Gov BC - BTR - Web UI',
          type: [
            'selfDeclaration'
          ]
        },
        statementDate: '2024-01-30',
        statementID: 'ea7e5edb-8d2c-4970-b90a-2e3a237fd67b',
        statementType: 'ownershipOrControlStatement',
        subject: {
          describedByEntityStatement: ''
        }
      },
      {
        interestedParty: {
          describedByPersonStatement: 'b04ce8de-cd95-4fa2-991d-3a06fe34deb0'
        },
        interests: [
          {
            details: 'controlType.directors.inConcertControl',
            directOrIndirect: 'indirect',
            startDate: '2024-01-05',
            type: 'appointmentOfBoard'
          },
          {
            details: 'controlType.shares.registeredOwner',
            directOrIndirect: 'direct',
            share: {
              exclusiveMaximum: false,
              exclusiveMinimum: false,
              maximum: 50,
              minimum: 25
            },
            startDate: '2024-01-05',
            type: 'votingRights'
          },
          {
            details: 'controlType.votes.registeredOwner',
            directOrIndirect: 'direct',
            share: {
              exclusiveMaximum: false,
              exclusiveMinimum: true,
              maximum: 75,
              minimum: 50
            },
            startDate: '2024-01-05',
            type: 'shareholding'
          },
          {
            details: 'controlType.shares.indirectControl',
            directOrIndirect: 'indirect',
            share: {
              exclusiveMaximum: false,
              exclusiveMinimum: false,
              maximum: 50,
              minimum: 25
            },
            startDate: '2024-01-05',
            type: 'votingRights'
          },
          {
            details: 'controlType.votes.indirectControl',
            directOrIndirect: 'indirect',
            share: {
              exclusiveMaximum: false,
              exclusiveMinimum: true,
              maximum: 75,
              minimum: 50
            },
            startDate: '2024-01-05',
            type: 'shareholding'
          },
          {
            details: 'This is something tottaly else',
            type: 'otherInfluenceOrControl'
          }
        ],
        isComponent: false,
        publicationDetails: {
          bodsVersion: '0.3',
          publicationDate: '2024-01-30',
          publisher: {
            name: 'BCROS - BC Registries and Online Services',
            url: 'https://www.bcregistry.gov.bc.ca/'
          }
        },
        source: {
          assertedBy: [
            {
              name: 'Hrvoje Fekete'
            }
          ],
          description: 'Using Gov BC - BTR - Web UI',
          type: [
            'selfDeclaration'
          ]
        },
        statementDate: '2024-01-30',
        statementID: 'bee007d7-0520-4f2d-b6f0-a74a999d956f',
        statementType: 'ownershipOrControlStatement',
        subject: {
          describedByEntityStatement: ''
        }
      },
      {
        interestedParty: {
          describedByPersonStatement: '0a9d4f95-ca72-42b4-8906-05d889e4bb52'
        },
        interests: [
          {
            details: 'controlType.directors.directControl',
            directOrIndirect: 'direct',
            startDate: '2024-01-05',
            type: 'appointmentOfBoard'
          },
          {
            details: 'controlType.directors.indirectControl',
            directOrIndirect: 'indirect',
            startDate: '2024-01-05',
            type: 'appointmentOfBoard'
          }
        ],
        isComponent: false,
        publicationDetails: {
          bodsVersion: '0.3',
          publicationDate: '2024-01-30',
          publisher: {
            name: 'BCROS - BC Registries and Online Services',
            url: 'https://www.bcregistry.gov.bc.ca/'
          }
        },
        source: {
          assertedBy: [
            {
              name: 'Hrvoje Fekete'
            }
          ],
          description: 'Using Gov BC - BTR - Web UI',
          type: [
            'selfDeclaration'
          ]
        },
        statementDate: '2024-01-30',
        statementID: 'c41ede1d-4502-4711-aebd-833642e98ff7',
        statementType: 'ownershipOrControlStatement',
        subject: {
          describedByEntityStatement: ''
        }
      }
    ],
    personStatements: [
      {
        determinationOfIncapacity: false,
        addresses: [
          {
            city: 'Beamsville',
            country: 'CA',
            countryName: 'Canada',
            street: '4520 Ontario',
            streetAdditional: 'This is optional test',
            locationDescription: 'This is optional extra description test',
            postalCode: 'L0R 1B0',
            region: 'ON'
          }
        ],
        birthDate: '1901-01-01',
        email: 'hrvoje.fekete+1@gmail.com',
        phoneNumber: {
          countryCallingCode: '1',
          countryCode2letterIso: 'ca',
          number: '1234567890',
          extension: '33'
        },
        hasTaxNumber: false,
        identifiers: [],
        isComponent: false,
        isPermanentResidentCa: false,
        missingInfoReason: '',
        names: [
          {
            fullName: 'Hrvoje Feketele',
            type: 'individual'
          },
          {
            fullName: 'baba jaga',
            type: 'alternative'
          }
        ],
        nationalities: [
          {
            code: 'AR',
            name: 'Argentina'
          },
          {
            code: 'IO',
            name: 'British Indian Ocean Territory'
          },
          {
            code: 'CC',
            name: 'Cocos (Keeling) Islands'
          }
        ],
        personType: 'knownPerson',
        placeOfResidence: {
          city: 'Beamsville',
          country: 'CA',
          countryName: 'Canada',
          street: '4520 Ontario',
          streetAdditional: 'This is optional test',
          locationDescription: 'This is optional extra description test',
          postalCode: 'L0R 1B0',
          region: 'ON'
        },
        publicationDetails: {
          bodsVersion: '0.3',
          publicationDate: '2024-01-30',
          publisher: {
            name: 'BCROS - BC Registries and Online Services',
            url: 'https://www.bcregistry.gov.bc.ca/'
          }
        },
        source: {
          assertedBy: [
            {
              name: 'Hrvoje Fekete'
            }
          ],
          description: 'Using Gov BC - BTR - Web UI',
          type: [
            'selfDeclaration'
          ]
        },
        statementDate: '2024-01-30',
        statementID: 'b0882814-34e2-42e9-b065-a550d94c9df1',
        statementType: 'personStatement',
        taxResidencies: []
      },
      {
        determinationOfIncapacity: false,
        addresses: [
          {
            city: 'Scarborough',
            country: 'CA',
            countryName: 'Canada',
            street: 'F-3331 Danforth Ave',
            streetAdditional: '',
            locationDescription: '',
            postalCode: 'M1L 1C5',
            region: 'ON'
          }
        ],
        birthDate: '1991-01-24',
        email: 'hrvoje.fekete@gmail.com',
        phoneNumber: {
          countryCallingCode: '1',
          countryCode2letterIso: 'ca',
          number: '1234567890',
          extension: '33'
        },
        hasTaxNumber: true,
        identifiers: [
          {
            id: '046 454 286',
            scheme: 'CAN-TAXID',
            schemeName: 'ITN'
          }
        ],
        isComponent: false,
        isPermanentResidentCa: true,
        missingInfoReason: 'It actually really is unless it is not',
        names: [
          {
            fullName: 'Hrvoje Fekete',
            type: 'individual'
          },
          {
            fullName: 'Johnny',
            type: 'alternative'
          }
        ],
        nationalities: [],
        personType: 'knownPerson',
        placeOfResidence: {
          city: 'Scarborough',
          country: 'CA',
          countryName: 'Canada',
          street: 'F-3331 Danforth Ave',
          streetAdditional: '',
          locationDescription: '',
          postalCode: 'M1L 1C5',
          region: 'ON'
        },
        publicationDetails: {
          bodsVersion: '0.3',
          publicationDate: '2024-01-30',
          publisher: {
            name: 'BCROS - BC Registries and Online Services',
            url: 'https://www.bcregistry.gov.bc.ca/'
          }
        },
        source: {
          assertedBy: [
            {
              name: 'Hrvoje Fekete'
            }
          ],
          description: 'Using Gov BC - BTR - Web UI',
          type: [
            'selfDeclaration'
          ]
        },
        statementDate: '2024-01-30',
        statementID: 'b04ce8de-cd95-4fa2-991d-3a06fe34deb0',
        statementType: 'personStatement',
        taxResidencies: [
          {
            code: 'CA',
            name: 'Canada'
          }
        ]
      },
      {
        determinationOfIncapacity: false,
        addresses: [
          {
            city: 'Vancouver',
            country: 'CA',
            countryName: 'Canada',
            street: '403-1265 Barclay St',
            streetAdditional: '',
            locationDescription: '',
            postalCode: 'V6E 1H5',
            region: 'BC'
          }
        ],
        email: 'hrvoje.fekete@gmail.com',
        phoneNumber: {
          countryCallingCode: '1',
          countryCode2letterIso: 'ca',
          number: '1234567890',
          extension: '33'
        },
        hasTaxNumber: false,
        identifiers: [],
        isComponent: false,
        isPermanentResidentCa: false,
        names: [
          {
            fullName: 'Hrvoje Fekete',
            type: 'individual'
          }
        ],
        nationalities: [
          {
            code: 'CA',
            name: 'Canada'
          }
        ],
        personType: 'knownPerson',
        placeOfResidence: {
          city: 'Vancouver',
          country: 'CA',
          countryName: 'Canada',
          street: '403-1265 Barclay St',
          streetAdditional: '',
          locationDescription: '',
          postalCode: 'V6E 1H5',
          region: 'BC'
        },
        publicationDetails: {
          bodsVersion: '0.3',
          publicationDate: '2024-01-30',
          publisher: {
            name: 'BCROS - BC Registries and Online Services',
            url: 'https://www.bcregistry.gov.bc.ca/'
          }
        },
        source: {
          assertedBy: [
            {
              name: 'Hrvoje Fekete'
            }
          ],
          description: 'Using Gov BC - BTR - Web UI',
          type: [
            'selfDeclaration'
          ]
        },
        statementDate: '2024-01-30',
        statementID: '0a9d4f95-ca72-42b4-8906-05d889e4bb52',
        statementType: 'personStatement',
        taxResidencies: [
          {
            code: 'CA',
            name: 'Canada'
          }
        ]
      }
    ]
  },
  submitted_datetime: '2024-01-30T09:57:53.160442-08:00',
  submitter_id: null,
  type: 'other'
}

export const expectedSisOutput: SiSchemaType[] = [
  {
    controlOther: 'everything',
    couldNotProvideMissingInfo: false,
    determinationOfIncapacity: false,
    missingInfoReason: '',
    name: {
      isYourOwnInformation: false,
      isUsePreferredName: true,
      fullName: 'Hrvoje Feketele',
      preferredName: 'baba jaga'
    },
    address: {
      city: 'Beamsville',
      country: { alpha_2: 'CA', name: 'Canada' },
      line1: '4520 Ontario',
      line2: 'This is optional test',
      locationDescription: 'This is optional extra description test',
      postalCode: 'L0R 1B0',
      region: 'ON'
    },
    controlOfDirectors: {
      actingJointly: false,
      directControl: true,
      inConcertControl: true,
      indirectControl: true,
      significantInfluence: true
    },
    controlOfShares: {
      controlName: 'controlOfShares',
      percentage: PercentageRangeE.AT_LEAST_25_TO_50,
      beneficialOwner: true,
      inConcertControl: true,
      indirectControl: true,
      registeredOwner: true,
      actingJointly: false
    },
    controlOfVotes: {
      actingJointly: false,
      controlName: 'controlOfVotes',
      registeredOwner: false,
      beneficialOwner: false,
      indirectControl: false,
      inConcertControl: false,
      percentage: PercentageRangeE.NO_SELECTION
    },
    birthDate: '1901-01-01',
    citizenships: [{ name: 'Argentina', alpha_2: 'AR' },
      { name: 'British Indian Ocean Territory', alpha_2: 'IO' },
      { name: 'Cocos (Keeling) Islands', alpha_2: 'CC' }],
    email: 'hrvoje.fekete+1@gmail.com',
    phoneNumber: {
      countryCallingCode: '1',
      countryCode2letterIso: 'ca',
      number: '1234567890',
      extension: '33'
    },
    tax: {
      hasTaxNumber: false,
      taxNumber: undefined
    },
    isTaxResident: false,
    effectiveDates: [
      {
        endDate: undefined,
        startDate: '2024-01-04'
      },
      {
        endDate: undefined,
        startDate: ''
      }
    ],
    uuid: undefined,
    ui: {
      newOrUpdatedFields: []
    }
  },
  {
    missingInfoReason: 'It actually really is unless it is not',
    name: {
      isUsePreferredName: true,
      isYourOwnInformation: false,
      fullName: 'Hrvoje Fekete',
      preferredName: 'Johnny'
    },
    address: {
      city: 'Scarborough',
      country: { alpha_2: 'CA', name: 'Canada' },
      line1: 'F-3331 Danforth Ave',
      line2: '',
      locationDescription: '',
      postalCode: 'M1L 1C5',
      region: 'ON'
    },
    controlOfDirectors: {
      actingJointly: false,
      directControl: false,
      inConcertControl: true,
      indirectControl: false,
      significantInfluence: false
    },
    controlOfShares: {
      controlName: 'controlOfShares',
      percentage: PercentageRangeE.MORE_THAN_50_TO_75,
      beneficialOwner: false,
      inConcertControl: false,
      indirectControl: true,
      actingJointly: false,
      registeredOwner: true
    },
    controlOfVotes: {
      controlName: 'controlOfVotes',
      registeredOwner: true,
      beneficialOwner: false,
      indirectControl: true,
      inConcertControl: false,
      actingJointly: false,
      percentage: PercentageRangeE.AT_LEAST_25_TO_50
    },
    controlOther: 'This is something tottaly else',
    birthDate: '1991-01-24',
    citizenships:
      [{ alpha_2: 'CA_PR', name: 'Canada (Permanent Resident)' }],
    email: 'hrvoje.fekete@gmail.com',
    phoneNumber: {
      countryCallingCode: '1',
      countryCode2letterIso: 'ca',
      number: '1234567890',
      extension: '33'
    },
    couldNotProvideMissingInfo: true,
    determinationOfIncapacity: false,
    tax: {
      taxNumber: '046 454 286',
      hasTaxNumber: true
    },
    isTaxResident: true,
    effectiveDates: [
      {
        endDate: undefined,
        startDate: '2024-01-05'
      },
      {
        endDate: undefined,
        startDate: ''
      }
    ],
    uuid: undefined,
    ui: {
      newOrUpdatedFields: []
    }

  },
  {
    controlOfDirectors: {
      actingJointly: false,
      directControl: true,
      inConcertControl: false,
      indirectControl: true,
      significantInfluence: false
    },
    controlOfShares: {
      controlName: 'controlOfShares',
      percentage: PercentageRangeE.NO_SELECTION,
      beneficialOwner: false,
      inConcertControl: false,
      indirectControl: false,
      actingJointly: false,
      registeredOwner: false
    },
    controlOfVotes: {
      controlName: 'controlOfVotes',
      registeredOwner: false,
      beneficialOwner: false,
      indirectControl: false,
      actingJointly: false,
      inConcertControl: false,
      percentage: PercentageRangeE.NO_SELECTION
    },
    controlOther: '',
    couldNotProvideMissingInfo: false,
    determinationOfIncapacity: false,
    missingInfoReason: undefined,
    name: {
      isUsePreferredName: false,
      isYourOwnInformation: false,
      fullName: 'Hrvoje Fekete',
      preferredName: ''
    },
    tax: {
      hasTaxNumber: false,
      taxNumber: undefined
    },
    address: {
      city: 'Vancouver',
      country: { alpha_2: 'CA', name: 'Canada' },
      line1: '403-1265 Barclay St',
      line2: '',
      locationDescription: '',
      postalCode: 'V6E 1H5',
      region: 'BC'
    },
    birthDate: '',
    citizenships:
      [{ name: 'Canada (Citizen)', alpha_2: 'CA' }],
    email: 'hrvoje.fekete@gmail.com',
    phoneNumber: {
      countryCallingCode: '1',
      countryCode2letterIso: 'ca',
      number: '1234567890',
      extension: '33'
    },
    isTaxResident: true,
    effectiveDates: [
      {
        endDate: undefined,
        startDate: '2024-01-05'
      }
    ],
    uuid: undefined,
    ui: {
      newOrUpdatedFields: []
    }
  }
]
