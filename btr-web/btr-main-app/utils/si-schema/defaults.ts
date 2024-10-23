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
    mailingAddress: {
      isDifferent: false,
      address: undefined
    },
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

    effectiveDates: [{ startDate: undefined, endDate: undefined }],
    phoneNumber: {
      countryCode2letterIso: undefined,
      countryCallingCode: undefined,
      number: undefined,
      extension: undefined
    },
    uuid: UUIDv4(),
    ui: {
      newOrUpdatedFields: [],
      actions: []
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
