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
            details: 'controlType.sharesOrVotes.registeredOwner',
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
            details: 'controlType.sharesOrVotes.indirectControl',
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
            details: 'controlType.sharesOrVotes.inConcertControl',
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
            details: 'controlType.sharesOrVotes.beneficialOwner',
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
            details: 'controlType.sharesOrVotes.registeredOwner',
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
            details: 'controlType.sharesOrVotes.registeredOwner',
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
            details: 'controlType.sharesOrVotes.indirectControl',
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
            details: 'controlType.sharesOrVotes.indirectControl',
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

export const expectedSisOutput = [{
  controlType: {
    directors: {
      directControl: true,
      inConcertControl: true,
      indirectControl: true,
      significantInfluence: true
    },
    sharesVotes: {
      beneficialOwner: true,
      inConcertControl: true,
      indirectControl: true,
      registeredOwner: true
    },
    other: 'everything'
  },
  missingInfoReason: '',
  percentOfShares: 'atLeast25To50',
  percentOfVotes: 'noSelection',
  profile: {
    fullName: 'Hrvoje Feketele',
    preferredName: 'baba jaga',
    address: {
      city: 'Beamsville',
      country: { alpha_2: 'CA', name: 'Canada' },
      line1: '4520 Ontario',
      line2: 'This is optional test',
      locationDescription: 'This is optional extra description test',
      postalCode: 'L0R 1B0',
      region: 'ON'
    },
    competency: {
      decisionMaking: undefined,
      financialAffairs: undefined
    },
    birthDate: '1901-01-01',
    citizenshipCA: 'other',
    citizenships: [{ name: 'Argentina', alpha_2: 'AR' },
      { name: 'British Indian Ocean Territory', alpha_2: 'IO' },
      { name: 'Cocos (Keeling) Islands', alpha_2: 'CC' }],
    email: 'hrvoje.fekete+1@gmail.com',
    hasTaxNumber: false,
    taxNumber: undefined,
    isTaxResident: false
  },
  startDate: '2024-01-30',
  uuid: 'b0882814-34e2-42e9-b065-a550d94c9df1'
}, {
  controlType: {
    directors: {
      directControl: false,
      inConcertControl: true,
      indirectControl: false,
      significantInfluence: false
    },
    sharesVotes: {
      beneficialOwner: false,
      inConcertControl: false,
      indirectControl: true,
      registeredOwner: true
    },
    other: 'This is something tottaly else'
  },
  missingInfoReason: 'It actually really is unless it is not',
  percentOfShares: 'moreThan50To75',
  percentOfVotes: 'atLeast25To50',
  profile: {
    fullName: 'Hrvoje Fekete',
    preferredName: 'Johnny',
    address: {
      city: 'Scarborough',
      country: { alpha_2: 'CA', name: 'Canada' },
      line1: 'F-3331 Danforth Ave',
      line2: '',
      locationDescription: '',
      postalCode: 'M1L 1C5',
      region: 'ON'
    },
    competency: {
      decisionMaking: undefined,
      financialAffairs: undefined
    },
    birthDate: '1991-01-24',
    citizenshipCA: 'permanentResident',
    citizenships: [{ alpha_2: 'CA_PR', name: 'Canada (Permanent Resident)' }],
    email: 'hrvoje.fekete@gmail.com',
    hasTaxNumber: true,
    taxNumber: '046 454 286',
    isTaxResident: true
  },
  startDate: '2024-01-30',
  uuid: 'b04ce8de-cd95-4fa2-991d-3a06fe34deb0'
}, {
  controlType: {
    directors: {
      directControl: true,
      inConcertControl: false,
      indirectControl: true,
      significantInfluence: false
    },
    sharesVotes: {
      beneficialOwner: false,
      inConcertControl: false,
      indirectControl: false,
      registeredOwner: false
    },
    other: ''
  },
  missingInfoReason: undefined,
  percentOfShares: 'noSelection',
  percentOfVotes: 'noSelection',
  profile: {
    fullName: 'Hrvoje Fekete',
    preferredName: '',
    taxNumber: undefined,
    address: {
      city: 'Vancouver',
      country: { alpha_2: 'CA', name: 'Canada' },
      line1: '403-1265 Barclay St',
      line2: '',
      locationDescription: '',
      postalCode: 'V6E 1H5',
      region: 'BC'
    },
    competency: {
      decisionMaking: undefined,
      financialAffairs: undefined
    },
    birthDate: undefined,
    citizenshipCA: 'citizen',
    citizenships: [{ name: 'Canada (Citizen)', alpha_2: 'CA' }],
    email: 'hrvoje.fekete@gmail.com',
    hasTaxNumber: false,
    isTaxResident: true
  },
  startDate: '2024-01-30',
  uuid: '0a9d4f95-ca72-42b4-8906-05d889e4bb52'
}]
