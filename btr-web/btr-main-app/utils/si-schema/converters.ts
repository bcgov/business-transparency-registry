import { SignificantIndividualI } from '~/interfaces/significant-individual-i'
import { FilingActionE } from '~/enums/filing-action-e'
import { SiSchemaType } from '~/utils/si-schema/definitions'

// todo: fix some typings here (add in converters if needed)
export const convertSchemaToSi = (si: SiSchemaType, startDate: string, isEditing: boolean): SignificantIndividualI => {
  return {
    isYourOwnInformation: si.name?.isYourOwnInformation,
    profile: {
      fullName: si.name?.fullName,
      preferredName: si.name?.preferredName,
      citizenshipCA: [],
      citizenships: si.citizenships,
      email: si.email,
      address: si.address,
      birthDate: si.birthDate,
      hasTaxNumber: si.tax?.hasTaxNumber,
      taxNumber: si.tax?.taxNumber,
      isTaxResident: si.isTaxResident
    },
    startDate,
    endDate: undefined,
    action: isEditing ? FilingActionE.EDIT : FilingActionE.ADD,
    missingInfoReason: si.missingInfoReason,
    controlType: {
      other: si.controlOther,
      sharesVotes: {
        registeredOwner: si.controlOfShares?.registeredOwner,
        beneficialOwner: si.controlOfShares?.beneficialOwner,
        indirectControl: si.controlOfShares?.indirectControl,
        inConcertControl: si.controlOfShares?.inConcertControl
      },
      directors: {
        directControl: si.controlOfDirectors?.directControl,
        indirectControl: si.controlOfDirectors?.indirectControl,
        significantInfluence: si.controlOfDirectors?.significantInfluence,
        inConcertControl: si.controlOfDirectors?.inConcertControl
      }
    },
    percentOfShares: si.controlOfShares.percentage,
    percentOfVotes: si.controlOfVotes.percentage
  }
}

export const convertSiToSchema = (sii: SignificantIndividualI): SiSchemaType => {
  return {
    address: sii.profile.address,
    controlOfDirectors: {
      inConcertControl: sii.controlType.directors.inConcertControl,
      directControl: sii.controlType.directors.directControl,
      significantInfluence: sii.controlType.directors.significantInfluence,
      indirectControl: sii.controlType.directors.indirectControl
    },
    controlOfShares: {
      controlName: 'controlOfShares',
      percentage: sii.percentOfShares,
      inConcertControl: sii.controlType.sharesVotes.inConcertControl,
      indirectControl: sii.controlType.sharesVotes.inConcertControl,
      registeredOwner: sii.controlType.sharesVotes.inConcertControl,
      beneficialOwner: sii.controlType.sharesVotes.inConcertControl
    },
    controlOfVotes: {
      controlName: 'controlOfVotes',
      percentage: sii.percentOfVotes,
      inConcertControl: sii.controlType.sharesVotes.inConcertControl,
      indirectControl: sii.controlType.sharesVotes.inConcertControl,
      registeredOwner: sii.controlType.sharesVotes.inConcertControl,
      beneficialOwner: sii.controlType.sharesVotes.inConcertControl
    },
    controlOther: sii.controlType.other,
    citizenships: sii.profile.citizenships,
    missingInfoReason: sii.missingInfoReason,
    couldNotProvideMissingInfo: sii.missingInfoReason ? !!sii.missingInfoReason.trim() : false,
    birthDate: sii.profile.birthDate,
    email: sii.profile.email,
    tax: {
      taxNumber: sii.profile.taxNumber ? sii.profile.taxNumber : null,
      hasTaxNumber: !!sii.profile.taxNumber
    },
    name: {
      preferredName: sii.profile.preferredName,
      fullName: sii.profile.fullName,
      isYourOwnInformation: !!sii.isYourOwnInformation,
      isUsePreferredName: !!(sii.profile?.preferredName?.trim())
    },
    isTaxResident: sii.profile.isTaxResident
  }
}
