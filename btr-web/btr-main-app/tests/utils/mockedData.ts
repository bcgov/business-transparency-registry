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
  externalInfluence: ExternalInfluenceE.CAN_INFLUENCE,
  missingInfoReason: '',
  percentOfShares: '75',
  percentOfVotes: '25',
  startDate: '2025-01-01',
  action: FilingActionE.ADD
}
