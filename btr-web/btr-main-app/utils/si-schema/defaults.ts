import { AddressSchemaType, SiSchemaType } from '~/utils/si-schema/definitions'
import { PercentageRangeE } from '~/enums/percentage-range-e'
import { v4 as UUIDv4 } from 'uuid'
import { SignificantIndividualFilingI } from '~/interfaces/significant-individual-filing-i'
import { todayIsoString } from '../../../btr-common-components/utils/date'

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
    couldNotProvideMissingInfo: false,
    missingInfoReason: '',

    // replace when on 20760
    startDate: todayIsoString(),
    endDate: '',

    uuid: UUIDv4(),
    ui: {}
  }
}

export function getEmptySiFiling (): SignificantIndividualFilingI {
  return {
    effectiveDate: todayIsoString(),
    noSignificantIndividualsExist: false,
    significantIndividuals: [],
    businessIdentifier: '',
    certified: false,
    folioNumber: undefined
  }
}
