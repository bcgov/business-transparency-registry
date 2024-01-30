import { FilingActionE } from '~/enums/filing-action-e'

export const testSI: SignificantIndividualI = {
  profile: {
    fullName: 'Test Name',
    preferredName: 'Waffles Test',
    address: {
      city: 'Victoria',
      country: { name: 'Canada', alpha_2: 'CA' },
      line1: '1234 test street',
      postalCode: 'V1A 2B3',
      region: 'BC',
      line2: '',
      locationDescription: ''
    },
    competency: {
      decisionMaking: true,
      financialAffairs: true
    },
    birthDate: '2000-03-19',
    citizenshipCA: 'citizen',
    citizenshipsExCA: [],
    email: '1@1.com',
    isTaxResident: true,
    hasTaxNumber: true,
    taxNumber: '000 000 000'
  },
  controlType: {
    sharesVotes: {
      registeredOwner: true,
      beneficialOwner: false,
      indirectControl: false,
      inConcertControl: false
    },
    directors: {
      directControl: true,
      indirectControl: true,
      significantInfluence: false,
      inConcertControl: false
    },
    other: ''
  },
  missingInfoReason: '',
  percentOfShares: '75',
  percentOfVotes: '25',
  startDate: '2025-01-01',
  action: FilingActionE.ADD
}

export const SubmissionMock = {
  "business_identifier": "BC0871427",
  "effective_date": "2024-01-03",
  "id": 13,
  "payload": {
    "businessIdentifier": "BC0871427",
    "effectiveDate": "2024-01-03",
    "entityStatement": {
      "entityType": "legalEntity",
      "identifiers": [],
      "isComponent": false,
      "name": "0871427 B.C. LTD.",
      "publicationDetails": {
        "bodsVersion": "0.3",
        "publicationDate": "2024-01-26",
        "publisher": {
          "name": "BCROS - BC Registries and Online Services",
          "url": "https://www.bcregistry.gov.bc.ca/"
        }
      },
      "source": {
        "assertedBy": [
          {
            "name": "BCROS - BC Registries and Online Services",
            "uri": "https://www.bcregistry.gov.bc.ca/"
          }
        ],
        "retrievedAt": "2024-01-26T23:25:11.627Z",
        "type": [
          "officialRegister",
          "verified"
        ]
      },
      "statementDate": "2024-01-26",
      "statementID": "98314d8e-f76f-4c7b-98a0-8a5d216d623c",
      "statementType": "entityStatement"
    },
    "ownershipOrControlStatements": [
      {
        "interestedParty": {
          "describedByPersonStatement": "56747c2f-2187-4c7b-9f66-966da3d2c352"
        },
        "interests": [
          {
            "details": "controlType.directors.directControl",
            "directOrIndirect": "direct",
            "startDate": "2024-01-03",
            "type": "appointmentOfBoard"
          },
          {
            "details": "controlType.directors.indirectControl",
            "directOrIndirect": "indirect",
            "startDate": "2024-01-03",
            "type": "appointmentOfBoard"
          },
          {
            "details": "controlType.directors.registeredOwner",
            "directOrIndirect": "direct",
            "share": {
              "exclusiveMaximum": false,
              "maximum": 33
            },
            "startDate": "2024-01-03",
            "type": "shareholding"
          }
        ],
        "isComponent": false,
        "publicationDetails": {
          "bodsVersion": "0.3",
          "publicationDate": "2024-01-26",
          "publisher": {
            "name": "BCROS - BC Registries and Online Services",
            "url": "https://www.bcregistry.gov.bc.ca/"
          }
        },
        "source": {
          "assertedBy": [
            {
              "name": "Hrvoje Fekete"
            }
          ],
          "type": [
            "selfDeclaration"
          ]
        },
        "statementDate": "2024-01-26",
        "statementID": "11699ee5-ef87-4b00-b65a-357aaa55dcc7",
        "statementType": "ownershipOrControlStatement",
        "subject": {
          "describedByEntityStatement": ""
        }
      }
    ],
    "personStatements": [
      {
        "addresses": [
          {
            "city": "Vancouver",
            "country": {
              "alpha_2": "CA",
              "name": "Canada"
            },
            "line1": "403-1265 Barclay St",
            "line2": "",
            "locationDescription": "",
            "postalCode": "V6E 1H5",
            "region": "BC"
          }
        ],
        "birthDate": "1979-01-24",
        "email": "hrvoje.fekete@gmail.com",
        "hasTaxNumber": false,
        "identifiers": [],
        "isComponent": false,
        "isPermanentResidentCa": false,
        "names": [
          {
            "fullName": "Hrvoje Fekete",
            "type": "individual"
          }
        ],
        "nationalities": [
          {
            "code": "CA",
            "name": "Canada"
          }
        ],
        "personType": "knownPerson",
        "placeOfResidence": {
          "city": "Vancouver",
          "country": {
            "alpha_2": "CA",
            "name": "Canada"
          },
          "line1": "403-1265 Barclay St",
          "line2": "",
          "locationDescription": "",
          "postalCode": "V6E 1H5",
          "region": "BC"
        },
        "publicationDetails": {
          "bodsVersion": "0.3",
          "publicationDate": "2024-01-26",
          "publisher": {
            "name": "BCROS - BC Registries and Online Services",
            "url": "https://www.bcregistry.gov.bc.ca/"
          }
        },
        "source": {
          "assertedBy": [
            {
              "name": "Hrvoje Fekete"
            }
          ],
          "type": [
            "selfDeclaration"
          ]
        },
        "statementDate": "2024-01-26",
        "statementID": "56747c2f-2187-4c7b-9f66-966da3d2c352",
        "statementType": "personStatement",
        "taxResidencies": [
          {
            "code": "CA",
            "name": "Canada"
          }
        ]
      }
    ]
  },
  "submitted_datetime": "2024-01-26T15:25:12.214886-08:00",
  "submitter_id": null,
  "type": "other"
}
