import { v4 as UUIDv4 } from 'uuid'
import { todayIsoDateString } from '../../../btr-common-components/utils/date'
import { AddressSchemaType, SiSchemaType } from '~/utils/si-schema/definitions'
import { PercentageRangeE } from '~/enums/percentage-range-e'
import { SignificantIndividualFilingI } from '~/interfaces/significant-individual-filing-i'

export function getEmptyAddress (): AddressSchemaType {
  return {
    country: undefined,
    line1: '',
    line2: undefined,
    city: '',
    region: '',
    postalCode: '',
    locationDescription: undefined

  }
}

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
    address: getEmptyAddress(),
    birthDate: '',
    citizenships: [],
    tax: {
      hasTaxNumber: undefined,
      taxNumber: undefined
    },
    isTaxResident: undefined,
    determinationOfIncapacity: false,
    couldNotProvideMissingInfo: false,
    missingInfoReason: '',

    // replace when on 20760
    startDate: todayIsoDateString(),
    endDate: '',

    effectiveDates: [{ startDate: '2023-01-05', endDate: '2023-12-31' }],

    uuid: UUIDv4(),
    ui: {
      action: FilingActionE.ADD
    }
  }
}

export function getEmptySiFiling (): SignificantIndividualFilingI {
  return {
    effectiveDate: todayIsoDateString(),
    noSignificantIndividualsExist: false,
    significantIndividuals: [],
    businessIdentifier: '',
    certified: false,
    folioNumber: undefined
  }
}
