import { SiSchemaType } from '~/utils/si-schema/definitions'
import { PercentageRangeE } from '~/enums/percentage-range-e'

export function getDefaultInputFormSi (): SiSchemaType {
  return {
    name: {
      isYourOwnInformation: false,
      isUsePreferredName: false,
      fullName: '',
      preferredName: ''
    },
    controlOfShares: {
      controlName: 'controlOfShares',
      registeredOwner: false,
      beneficialOwner: false,
      indirectControl: false,
      inConcertControl: false,
      actingJointly: false,
      percentage: PercentageRangeE.NO_SELECTION
    },
    controlOfVotes: {
      controlName: 'controlOfVotes',
      registeredOwner: false,
      beneficialOwner: false,
      indirectControl: false,
      inConcertControl: false,
      actingJointly: false,
      percentage: PercentageRangeE.NO_SELECTION
    },
    controlOfDirectors: {
      directControl: false,
      indirectControl: false,
      significantInfluence: false,
      inConcertControl: false,
      actingJointly: false
    },
    controlOther: undefined,
    email: '',
    address: {
      country: null,
      line1: '',
      line2: undefined,
      city: '',
      region: '',
      postalCode: '',
      locationDescription: undefined
    },
    birthDate: '',
    citizenships: [],
    tax: {
      hasTaxNumber: null,
      taxNumber: null
    },
    isTaxResident: undefined,
    couldNotProvideMissingInfo: false,
    missingInfoReason: ''
  }
}
