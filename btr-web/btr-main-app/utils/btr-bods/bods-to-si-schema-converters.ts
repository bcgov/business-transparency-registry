import { BodsInterestTypeE, BodsNameTypeE, ControlOfSharesDetailsE } from '~/enums/btr-bods-e'
import { BtrFilingI } from '~/interfaces/btr-bods/btr-filing-i'
import { BtrBodsOwnershipOrControlI } from '~/interfaces/btr-bods/btr-bods-ownership-or-control-i'
import { BtrBodsPersonI } from '~/interfaces/btr-bods/btr-bods-person-i'
import { BodsBtrAddressI } from '~/interfaces/btr-bods/components-i'
import { PercentageRangeE } from '~/enums/percentage-range-e'
import {
  AddressSchemaType,
  CountrySchemaType,
  SiSchemaType
} from '~/utils/si-schema/definitions'
import { getEmptyAddress } from '~/utils/si-schema/defaults'

const _findOwnershipOrControlStatement =
  (submission: BtrFilingI, personStatementId: string): BtrBodsOwnershipOrControlI | null => {
    for (const oocs of submission.ownershipOrControlStatements) {
      if (oocs.interestedParty.describedByPersonStatement === personStatementId) {
        return oocs
      }
    }
    return null
  }

const _getSiName = (btrBodsPerson: BtrBodsPersonI, nameType: BodsNameTypeE): string => {
  const bodsName = btrBodsPerson.names.find(name => name.type === nameType)
  let retVal = ''
  if (bodsName) {
    retVal = bodsName.fullName || (`${bodsName.givenName} ${bodsName.familyName}`)
  }
  return retVal
}

const _getCitizenships = (btrBodsPerson: BtrBodsPersonI): CountrySchemaType[] => {
  const citizenships: CountrySchemaType[] = []

  // add PR info to the array since it is not included in btrBodsPerson.nationalities
  if (btrBodsPerson.isPermanentResidentCa) {
    citizenships.push({
      name: 'Canada (Permanent Resident)',
      alpha_2: 'CA_PR'
    })
  }

  for (const country of btrBodsPerson.nationalities) {
    const countryCode: string = country.code
    let countryName: string = country.name

    if (country.code === 'CA') {
      countryName = 'Canada (Citizen)'
    }

    citizenships.push({
      name: countryName,
      alpha_2: countryCode
    })
  }

  return citizenships
}

function _getSIAddress (btrBodsAddress: BodsBtrAddressI): AddressSchemaType {
  return {
    line1: btrBodsAddress.street,
    line2: btrBodsAddress.streetAdditional,
    city: btrBodsAddress.city,
    region: btrBodsAddress.region,
    postalCode: btrBodsAddress.postalCode,
    locationDescription: btrBodsAddress.locationDescription,
    country: {
      name: btrBodsAddress.countryName,
      alpha_2: btrBodsAddress.country
    }
  }
}

function _getTaxNumber (btrBodsPerson: BtrBodsPersonI) {
  const taxIdentifierCa =
    btrBodsPerson.identifiers.find(identifier =>
      identifier.scheme === 'CAN-TAXID' && identifier.schemeName === 'ITN'
    )
  return taxIdentifierCa?.id || undefined
}

const _getPercentageRange = (
  oocs: BtrBodsOwnershipOrControlI, interestType: BodsInterestTypeE, businessIdentifier: string, person: BtrBodsPersonI
): PercentageRangeE => {
  /**
   * Note: we assume the min and max values for all interests in oocs.interests are the same.
   * The first occurance of the interest that matches the interestType will be used to determine the range.
   *
   * We need to confirm:
   * 1) for oocs (ownershipOrControlStatement) provided by BtrSourceDescriptionProvidedByBtrGovBC,
   *    is it possible for two interests to have different min and max values?
   *
   * 2) how do we want to handle the oocs from external sources?
   */
  let min: number | undefined = 0
  let max: number | undefined = 0
  let range: PercentageRangeE = PercentageRangeE.NO_SELECTION

  for (const interest of oocs.interests) {
    if (interest.type === interestType) {
      min = interest.share?.minimum
      max = interest.share?.maximum
      break
    }
  }

  if (min === 0 && max === 25) {
    range = PercentageRangeE.LESS_THAN_25
  } else if (min === 25 && max === 50) {
    range = PercentageRangeE.AT_LEAST_25_TO_50
  } else if (min === 50 && max === 75) {
    range = PercentageRangeE.MORE_THAN_50_TO_75
  } else if (min === 75 && max === 100) {
    range = PercentageRangeE.MORE_THAN_75
  } else {
    range = PercentageRangeE.NO_SELECTION
    if (max || min) {
      const error = `Unable to determine the ${interestType} percentage range; ` +
        `business: ${businessIdentifier}, individual name: ${person.names[0].fullName}`

      console.error(error)
    }
  }

  return range
}

const isControlType = (oocs: BtrBodsOwnershipOrControlI, details: string): boolean => {
  return oocs.interests.findIndex(interest => interest.details === details) !== -1
}

function _getControlOther (oocs: BtrBodsOwnershipOrControlI) {
  const other = oocs.interests.find(interest => interest.type === BodsInterestTypeE.OTHER_INFLUENCE_OR_CONTROL)
  return other?.details || ''
}

const _getSi = (
  person: BtrBodsPersonI, oocs: BtrBodsOwnershipOrControlI, businessIdentifier: string
): SiSchemaType => {
  const preferredName = _getSiName(person, BodsNameTypeE.ALTERNATIVE)
  return {
    address: person.addresses ? _getSIAddress(person.addresses[0]) : getEmptyAddress(),
    controlOfDirectors: {
      directControl: isControlType(oocs, ControlOfDirectorsDetailsE.DIRECT_CONTROL),
      significantInfluence: isControlType(oocs, ControlOfDirectorsDetailsE.SIGNIFICANT_INFLUENCE),
      indirectControl: isControlType(oocs, ControlOfDirectorsDetailsE.INDIRECT_CONTROL),
      inConcertControl: isControlType(oocs, ControlOfDirectorsDetailsE.IN_CONCERT_CONTROL),
      actingJointly: isControlType(oocs, ControlOfDirectorsDetailsE.ACTING_JOINTLY)
    },
    controlOfShares: {
      controlName: 'controlOfShares',
      percentage: _getPercentageRange(oocs, BodsInterestTypeE.SHAREHOLDING, businessIdentifier, person),
      beneficialOwner: isControlType(oocs, ControlOfSharesDetailsE.BENEFICIAL_OWNER),
      indirectControl: isControlType(oocs, ControlOfSharesDetailsE.INDIRECT_CONTROL),
      registeredOwner: isControlType(oocs, ControlOfSharesDetailsE.REGISTERED_OWNER),
      inConcertControl: isControlType(oocs, ControlOfSharesDetailsE.IN_CONCERT_CONTROL),
      actingJointly: isControlType(oocs, ControlOfSharesDetailsE.ACTING_JOINTLY) // either keep it in details or
    },
    controlOfVotes: {
      controlName: 'controlOfVotes',
      percentage: _getPercentageRange(oocs, BodsInterestTypeE.VOTING_RIGHTS, businessIdentifier, person),
      beneficialOwner: isControlType(oocs, ControlOfVotesDetailsE.BENEFICIAL_OWNER),
      indirectControl: isControlType(oocs, ControlOfVotesDetailsE.INDIRECT_CONTROL),
      registeredOwner: isControlType(oocs, ControlOfVotesDetailsE.REGISTERED_OWNER),
      inConcertControl: isControlType(oocs, ControlOfVotesDetailsE.IN_CONCERT_CONTROL),
      actingJointly: isControlType(oocs, ControlOfVotesDetailsE.ACTING_JOINTLY) // either keep it in details or
    },
    controlOther: _getControlOther(oocs),
    citizenships: _getCitizenships(person),
    missingInfoReason: person.missingInfoReason,
    couldNotProvideMissingInfo: person.missingInfoReason ? !!person.missingInfoReason.trim() : false,
    birthDate: person.birthDate ? person.birthDate : '',
    email: person.email,
    tax: {
      hasTaxNumber: person.hasTaxNumber,
      taxNumber: _getTaxNumber(person)
    },
    name: {
      fullName: _getSiName(person, BodsNameTypeE.INDIVIDUAL),
      preferredName,
      isYourOwnInformation: false, // todo: fixme ?? how do we want to set this
      isUsePreferredName: !!(preferredName.trim())
    },
    isTaxResident: !!(person.taxResidencies.find(country => country.code === 'CA')),
    endDate: '',
    startDate: '',

    uuid: person.uuid,

    ui: {}
  }
}

export const getSIsFromBtrBodsSubmission = (submission: BtrFilingI): SiSchemaType[] => {
  const sis: SiSchemaType[] = []
  const businessIdentifier = submission.businessIdentifier
  for (const person of submission.personStatements) {
    const oocs = _findOwnershipOrControlStatement(submission, person.statementID)
    if (person && oocs) {
      sis.push(_getSi(person, oocs, businessIdentifier))
    }
  }
  return sis
}
