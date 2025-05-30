export const existingSiResponseWithSis = {
  business_identifier: 'BC0871427',
  effective_date: '2024-08-13',
  id: 557989,
  payload: {
    businessIdentifier: 'BC0871427',
    effectiveDate: '2024-08-13',
    entityStatement: {
      entityType: 'legalEntity',
      identifiers: [],
      isComponent: false,
      name: '0871427 B.C. LTD.',
      publicationDetails: {
        bodsVersion: '0.3',
        publicationDate: '2024-08-13',
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
        retrievedAt: '2024-08-13T22:55:13.053Z',
        type: [
          'officialRegister',
          'verified'
        ]
      },
      statementDate: '2024-08-13',
      statementID: 'cdeaafc2-d36f-4954-a841-d39d43ece313',
      statementType: 'entityStatement'
    },
    noSignificantIndividualsExist: false,
    ownershipOrControlStatements: [
      {
        interestedParty: {
          describedByPersonStatement: '1ce633f7-0d61-4075-bb3a-f66a797e1a14'
        },
        interests: [
          {
            details: 'controlType.shares.beneficialOwner',
            directOrIndirect: 'direct',
            endDate: '2024-08-07',
            share: {
              exclusiveMaximum: false,
              exclusiveMinimum: false,
              maximum: 50,
              minimum: 25
            },
            startDate: '2024-08-01',
            type: 'shareholding'
          }
        ],
        isComponent: false,
        publicationDetails: {
          bodsVersion: '0.3',
          publicationDate: '2024-08-13',
          publisher: {
            name: 'BCROS - BC Registries and Online Services',
            url: 'https://www.bcregistry.gov.bc.ca/'
          }
        },
        source: {
          assertedBy: [
            {
              name: 'mr persons'
            }
          ],
          description: 'Using Gov BC - BTR - Web UI',
          type: [
            'selfDeclaration'
          ]
        },
        statementDate: '2024-08-13',
        statementID: '58bca0c6-d221-438a-899c-5a98d83ead67',
        statementType: 'ownershipOrControlStatement',
        subject: {
          describedByEntityStatement: ''
        }
      },
      {
        interestedParty: {
          describedByPersonStatement: '752ec662-ed65-4308-b456-f7df744e09bd'
        },
        interests: [
          {
            details: 'controlType.shares.registeredOwner',
            directOrIndirect: 'direct',
            share: {
              exclusiveMaximum: false,
              exclusiveMinimum: true,
              maximum: 75,
              minimum: 50
            },
            startDate: '2024-08-01',
            type: 'shareholding'
          },
          {
            connectedIndividuals: [
              {
                legalName: 'Fake person',
                preferredName: 'two face',
                uuid: 'fakestatementid-4959391-fjjlekf'
              }
            ],
            details: 'controlType.shares.actingJointly',
            directOrIndirect: 'unknown',
            share: {
              exclusiveMaximum: false,
              exclusiveMinimum: true,
              maximum: 75,
              minimum: 50
            },
            startDate: '2024-08-01',
            type: 'shareholding'
          }
        ],
        isComponent: false,
        publicationDetails: {
          bodsVersion: '0.3',
          publicationDate: '2024-08-13',
          publisher: {
            name: 'BCROS - BC Registries and Online Services',
            url: 'https://www.bcregistry.gov.bc.ca/'
          }
        },
        source: {
          assertedBy: [
            {
              name: 'mr persons'
            }
          ],
          description: 'Using Gov BC - BTR - Web UI',
          type: [
            'selfDeclaration'
          ]
        },
        statementDate: '2024-08-13',
        statementID: '837af5ae-d571-4fa7-9cf9-de5553f3388d',
        statementType: 'ownershipOrControlStatement',
        subject: {
          describedByEntityStatement: ''
        }
      },
      {
        interestedParty: {
          describedByPersonStatement: '161f5c5e-b9ac-4fbc-a7fc-349d85e5b546'
        },
        interests: [
          {
            details: 'controlType.directors.indirectControl',
            directOrIndirect: 'indirect',
            startDate: '2024-04-03',
            type: 'appointmentOfBoard'
          }, {
            details: 'controlType.shares.beneficialOwner',
            directOrIndirect: 'direct',
            share: {
              exclusiveMaximum: false,
              exclusiveMinimum: true,
              maximum: 75,
              minimum: 50
            },
            startDate: '2024-04-03',
            type: 'shareholding'
          },
          {
            details: 'controlType.shares.registeredOwner',
            directOrIndirect: 'direct',
            share: {
              exclusiveMaximum: false,
              exclusiveMinimum: true,
              maximum: 75,
              minimum: 50
            },
            startDate: '2024-04-03',
            type: 'shareholding'
          },
          {
            details: 'controlType.votes.beneficialOwner',
            directOrIndirect: 'direct',
            share: {
              exclusiveMaximum: false,
              exclusiveMinimum: false,
              maximum: 50,
              minimum: 25
            },
            startDate: '2024-04-03',
            type: 'votingRights'
          },
          {
            details: 'controlType.votes.registeredOwner',
            directOrIndirect: 'direct',
            share: {
              exclusiveMaximum: false,
              exclusiveMinimum: false,
              maximum: 50,
              minimum: 25
            },
            startDate: '2024-04-03',
            type: 'votingRights'
          }

        ],
        isComponent: false,
        publicationDetails: {
          bodsVersion: '0.3',
          publicationDate: '2024-08-13',
          publisher: {
            name: 'BCROS - BC Registries and Online Services',
            url: 'https://www.bcregistry.gov.bc.ca/'
          }
        },
        source: {
          assertedBy: [
            {
              name: 'mr persons'
            }
          ],
          description: 'Using Gov BC - BTR - Web UI',
          type: [
            'selfDeclaration'
          ]
        },
        statementDate: '2024-08-13',
        statementID: 'f7a1f997-3c2a-46d2-bd78-3aaecf3eaef6',
        statementType: 'ownershipOrControlStatement',
        subject: {
          describedByEntityStatement: ''
        }
      },
      {
        interestedParty: {
          describedByPersonStatement: 'fakestatementid-4959391-fjjlekf'
        },
        interests: [
          {
            details: 'controlType.shares.registeredOwner',
            directOrIndirect: 'direct',
            share: {
              exclusiveMaximum: false,
              exclusiveMinimum: true,
              maximum: 75,
              minimum: 50
            },
            startDate: '2024-08-01',
            type: 'shareholding'
          },
          {
            connectedIndividuals: [
              {
                legalName: 'warble wabbles',
                preferredName: '',
                uuid: '752ec662-ed65-4308-b456-f7df744e09bd'
              }
            ],
            details: 'controlType.shares.actingJointly',
            directOrIndirect: 'unknown',
            share: {
              exclusiveMaximum: false,
              exclusiveMinimum: true,
              maximum: 75,
              minimum: 50
            },
            startDate: '2024-08-01',
            type: 'shareholding'
          }
        ],
        isComponent: false,
        publicationDetails: {
          bodsVersion: '0.3',
          publicationDate: '2024-08-13',
          publisher: {
            name: 'BCROS - BC Registries and Online Services',
            url: 'https://www.bcregistry.gov.bc.ca/'
          }
        },
        source: {
          assertedBy: [
            {
              name: 'mr persons'
            }
          ],
          description: 'Using Gov BC - BTR - Web UI',
          type: [
            'selfDeclaration'
          ]
        },
        statementDate: '2024-08-13',
        statementID: 'fake-tjgf',
        statementType: 'ownershipOrControlStatement',
        subject: {
          describedByEntityStatement: ''
        }
      },
      {
        interestedParty: {
          describedByPersonStatement: '979a1dbc-9131-4b45-8dad-82a7ccf517f1'
        },
        interests: [
          {
            details: 'controlType.shares.registeredOwner',
            directOrIndirect: 'direct',
            endDate: '2021-08-04',
            share: {
              exclusiveMaximum: false,
              exclusiveMinimum: true,
              maximum: 75,
              minimum: 50
            },
            startDate: '2017-08-03',
            type: 'shareholding'
          },
          {
            details: 'controlType.votes.indirectControl',
            directOrIndirect: 'indirect',
            endDate: '2021-08-04',
            share: {
              exclusiveMaximum: false,
              exclusiveMinimum: false,
              maximum: 50,
              minimum: 25
            },
            startDate: '2017-08-03',
            type: 'votingRights'
          },
          {
            details: 'something',
            endDate: '2021-08-04',
            startDate: '2017-08-03',
            type: 'otherInfluenceOrControl'
          },
          {
            details: 'controlType.shares.registeredOwner',
            directOrIndirect: 'direct',
            endDate: '2024-08-02',
            share: {
              exclusiveMaximum: false,
              exclusiveMinimum: true,
              maximum: 75,
              minimum: 50
            },
            startDate: '2024-08-01',
            type: 'shareholding'
          },
          {
            details: 'controlType.votes.indirectControl',
            directOrIndirect: 'indirect',
            endDate: '2024-08-02',
            share: {
              exclusiveMaximum: false,
              exclusiveMinimum: false,
              maximum: 50,
              minimum: 25
            },
            startDate: '2024-08-01',
            type: 'votingRights'
          },
          {
            details: 'something',
            endDate: '2024-08-02',
            startDate: '2024-08-01',
            type: 'otherInfluenceOrControl'
          }
        ],
        isComponent: false,
        publicationDetails: {
          bodsVersion: '0.3',
          publicationDate: '2024-08-13',
          publisher: {
            name: 'BCROS - BC Registries and Online Services',
            url: 'https://www.bcregistry.gov.bc.ca/'
          }
        },
        source: {
          assertedBy: [
            {
              name: 'mr persons'
            }
          ],
          description: 'Using Gov BC - BTR - Web UI',
          type: [
            'selfDeclaration'
          ]
        },
        statementDate: '2024-08-13',
        statementID: '79aaaa8a-5297-4621-8e3d-b3a71ef79559',
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
            city: 'Winnipeg',
            country: 'CA',
            countryName: 'Canada',
            locationDescription: ' ',
            postalCode: ' ',
            region: 'MB',
            street: ' ',
            streetAdditional: ' '
          }
        ],
        birthDate: '2024',
        determinationOfIncapacity: false,
        email: '2***@***.com',
        hasTaxNumber: true,
        identifiers: [
          {
            id: '*** **2 325',
            scheme: 'CAN-TAXID',
            schemeName: 'ITN'
          }
        ],
        isComponent: false,
        isPermanentResidentCa: false,
        missingInfoReason: '',
        names: [
          {
            fullName: 'klack klacketty',
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
        phoneNumber: {
          countryCallingCode: '1',
          countryCode2letterIso: 'CA',
          number: '435***'
        },
        placeOfResidence: {
          city: 'Winnipeg',
          country: 'CA',
          countryName: 'Canada',
          locationDescription: ' ',
          postalCode: ' ',
          region: 'MB',
          street: ' ',
          streetAdditional: ' '
        },
        publicationDetails: {
          bodsVersion: '0.3',
          publicationDate: '2024-08-13',
          publisher: {
            name: 'BCROS - BC Registries and Online Services',
            url: 'https://www.bcregistry.gov.bc.ca/'
          }
        },
        source: {
          assertedBy: [
            {
              name: 'mr persons'
            }
          ],
          description: 'Using Gov BC - BTR - Web UI',
          type: [
            'selfDeclaration'
          ]
        },
        statementDate: '2024-08-13',
        statementID: '1ce633f7-0d61-4075-bb3a-f66a797e1a14',
        statementType: 'personStatement',
        taxResidencies: [
          {
            code: 'CA',
            name: 'Canada'
          }
        ],
        uuid: '1ce633f7-0d61-4075-bb3a-f66a797e1a14'
      },
      {
        addresses: [
          {
            city: 'Fort McMurray',
            country: 'CA',
            countryName: 'Canada',
            locationDescription: ' ',
            postalCode: ' ',
            region: 'AB',
            street: ' ',
            streetAdditional: ' '
          }
        ],
        birthDate: '2024',
        determinationOfIncapacity: false,
        email: '4***@***.com',
        hasTaxNumber: false,
        identifiers: [],
        isComponent: false,
        isPermanentResidentCa: false,
        missingInfoReason: 'this reason is over 200 characters lala jlsnc skjfn kjs nfkjsla n jsnjsflj sljf' +
          ' jksnfjallalkdjlnf  jfsjcnshkbch aexb shkcbk skj j sfncjskfnjcnsjkfn  jsdnc kbfskbhsbfhb shd hbchfbsk' +
          ' s fsdlcnjn sfbch sfhbbslkncjslnck k ak csk bckhrb chksbrckjsr cl srjcnsjk rckhbr ckhbrs',
        names: [
          {
            fullName: 'warble wabbles',
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
        phoneNumber: {
          countryCallingCode: '1',
          countryCode2letterIso: 'CA',
          number: '455***'
        },
        placeOfResidence: {
          city: 'Fort McMurray',
          country: 'CA',
          countryName: 'Canada',
          locationDescription: ' ',
          postalCode: ' ',
          region: 'AB',
          street: ' ',
          streetAdditional: ' '
        },
        publicationDetails: {
          bodsVersion: '0.3',
          publicationDate: '2024-08-13',
          publisher: {
            name: 'BCROS - BC Registries and Online Services',
            url: 'https://www.bcregistry.gov.bc.ca/'
          }
        },
        source: {
          assertedBy: [
            {
              name: 'mr persons'
            }
          ],
          description: 'Using Gov BC - BTR - Web UI',
          type: [
            'selfDeclaration'
          ]
        },
        statementDate: '2024-08-13',
        statementID: '752ec662-ed65-4308-b456-f7df744e09bd',
        statementType: 'personStatement',
        taxResidencies: [],
        uuid: '752ec662-ed65-4308-b456-f7df744e09bd'
      },
      {
        addresses: [
          {
            city: 'Toronto',
            country: 'CA',
            countryName: 'Canada',
            locationDescription: ' ',
            postalCode: ' ',
            region: 'ON',
            street: ' ',
            streetAdditional: ' '
          }
        ],
        birthDate: '2005',
        determinationOfIncapacity: false,
        email: 'i***@***.com',
        hasTaxNumber: false,
        identifiers: [],
        isComponent: false,
        isPermanentResidentCa: false,
        missingInfoReason: 'this reason is under 200 characters',
        names: [
          {
            fullName: 'another tester',
            type: 'individual'
          },
          {
            fullName: 'tests lala',
            type: 'alternative'
          }
        ],
        nationalities: [
          {
            code: 'AF',
            name: 'Afghanistan'
          },
          {
            code: 'AL',
            name: 'Albania'
          },
          {
            code: 'DZ',
            name: 'Algeria'
          }
        ],
        personType: 'knownPerson',
        phoneNumber: {
          countryCallingCode: '1',
          countryCode2letterIso: 'CA',
          number: '250***'
        },
        placeOfResidence: {
          city: 'Toronto',
          country: 'CA',
          countryName: 'Canada',
          locationDescription: ' ',
          postalCode: ' ',
          region: 'ON',
          street: ' ',
          streetAdditional: ' '
        },
        publicationDetails: {
          bodsVersion: '0.3',
          publicationDate: '2024-08-13',
          publisher: {
            name: 'BCROS - BC Registries and Online Services',
            url: 'https://www.bcregistry.gov.bc.ca/'
          }
        },
        source: {
          assertedBy: [
            {
              name: 'mr persons'
            }
          ],
          description: 'Using Gov BC - BTR - Web UI',
          type: [
            'selfDeclaration'
          ]
        },
        statementDate: '2024-08-13',
        statementID: '161f5c5e-b9ac-4fbc-a7fc-349d85e5b546',
        statementType: 'personStatement',
        taxResidencies: [],
        uuid: '161f5c5e-b9ac-4fbc-a7fc-349d85e5b546'
      },
      {
        addresses: [
          {
            city: 'Calgary',
            country: 'CA',
            countryName: 'Canada',
            locationDescription: ' ',
            postalCode: ' ',
            region: 'AB',
            street: ' ',
            streetAdditional: ' '
          }
        ],
        birthDate: '1994',
        determinationOfIncapacity: false,
        email: 'e***@***.com',
        hasTaxNumber: false,
        identifiers: [],
        isComponent: false,
        isPermanentResidentCa: false,
        missingInfoReason: '',
        names: [
          {
            fullName: 'mr persons',
            type: 'individual'
          },
          {
            fullName: 'mrs person',
            type: 'alternative'
          }
        ],
        nationalities: [
          {
            code: 'AL',
            name: 'Albania'
          }
        ],
        personType: 'knownPerson',
        phoneNumber: {
          countryCallingCode: '1',
          countryCode2letterIso: 'CA',
          number: '553***'
        },
        placeOfResidence: {
          city: 'Calgary',
          country: 'CA',
          countryName: 'Canada',
          locationDescription: ' ',
          postalCode: ' ',
          region: 'AB',
          street: ' ',
          streetAdditional: ' '
        },
        publicationDetails: {
          bodsVersion: '0.3',
          publicationDate: '2024-08-13',
          publisher: {
            name: 'BCROS - BC Registries and Online Services',
            url: 'https://www.bcregistry.gov.bc.ca/'
          }
        },
        source: {
          assertedBy: [
            {
              name: 'mr persons'
            }
          ],
          description: 'Using Gov BC - BTR - Web UI',
          type: [
            'selfDeclaration'
          ]
        },
        statementDate: '2024-08-13',
        statementID: '979a1dbc-9131-4b45-8dad-82a7ccf517f1',
        statementType: 'personStatement',
        taxResidencies: [],
        uuid: '979a1dbc-9131-4b45-8dad-82a7ccf517f1'
      },
      {
        addresses: [
          {
            city: 'Vancouver',
            country: 'CA',
            countryName: 'Canada',
            locationDescription: ' ',
            postalCode: ' ',
            region: 'BC',
            street: ' ',
            streetAdditional: ' '
          }
        ],
        birthDate: '1990',
        determinationOfIncapacity: false,
        email: 'e***@***.com',
        hasTaxNumber: false,
        identifiers: [],
        isComponent: false,
        isPermanentResidentCa: false,
        missingInfoReason: '',
        names: [
          {
            fullName: 'Fake person',
            type: 'individual'
          },
          {
            fullName: 'two face',
            type: 'alternative'
          }
        ],
        nationalities: [
          {
            code: 'CA',
            name: 'Canada'
          }
        ],
        personType: 'knownPerson',
        phoneNumber: {
          countryCallingCode: '1',
          countryCode2letterIso: 'CA',
          number: '453***'
        },
        placeOfResidence: {
          city: 'Vancouver',
          country: 'CA',
          countryName: 'Canada',
          locationDescription: ' ',
          postalCode: ' ',
          region: 'BC',
          street: ' ',
          streetAdditional: ' '
        },
        publicationDetails: {
          bodsVersion: '0.3',
          publicationDate: '2024-08-13',
          publisher: {
            name: 'BCROS - BC Registries and Online Services',
            url: 'https://www.bcregistry.gov.bc.ca/'
          }
        },
        source: {
          assertedBy: [
            {
              name: 'mr persons'
            }
          ],
          description: 'Using Gov BC - BTR - Web UI',
          type: [
            'selfDeclaration'
          ]
        },
        statementDate: '2024-08-13',
        statementID: 'fakestatementid-4959391-fjjlekf',
        statementType: 'personStatement',
        taxResidencies: [],
        uuid: 'fakestatementid-4959391-fjjlekf'
      }
    ]
  },
  submitted_datetime: '2024-07-11T23:40:12.625251+00:00',
  submitter_id: 3,
  type: 'other'
}
