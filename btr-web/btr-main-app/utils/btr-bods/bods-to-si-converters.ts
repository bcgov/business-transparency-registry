import { BtrCountryI, BtrAddressI } from '../../../btr-common-components/interfaces/btr-address-i'
import { CitizenshipTypeE } from '../../../btr-common-components/enums/citizenship-type-e'
import { BodsInterestTypeE, BodsNameTypeE } from '~/enums/btr-bods-e'
import { SignificantIndividualI } from '~/interfaces/significant-individual-i'
import { BtrFilingI } from '~/interfaces/btr-bods/btr-filing-i'
import { BtrBodsOwnershipOrControlI } from '~/interfaces/btr-bods/btr-bods-ownership-or-control-i'
import { BtrBodsPersonI } from '~/interfaces/btr-bods/btr-bods-person-i'
import { BodsBtrAddressI } from '~/interfaces/btr-bods/components-i'
// import { BtrSourceDescriptionProvidedByBtrGovBC } from '~/utils/btr-bods/btr-bods-implementations'
import { ControlOfDirectorsI } from '~/interfaces/control-of-directors-i'
import { ControlOfSharesI } from '~/interfaces/control-of-shares-i'
import { ExternalInfluenceE } from '~/enums/external-influence-e'
import { PercentageRangeE } from '~/enums/percentage-range-e'

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

const _getCitizenships = (btrBodsPerson: BtrBodsPersonI): {
  citizenshipsExCA: BtrCountryI[],
  citizenshipsCA: CitizenshipTypeE
} => {
  if (btrBodsPerson.isPermanentResidentCa) {
    return { citizenshipsCA: CitizenshipTypeE.PR, citizenshipsExCA: [] }
  }

  const citizenshipsCA = CitizenshipTypeE.OTHER // default if other found add them to array
  const citizenships: BtrCountryI[] = []
  for (const country of btrBodsPerson.nationalities) {
    if (country.code === 'CA') {
      return { citizenshipsCA: CitizenshipTypeE.CITIZEN, citizenshipsExCA: [] }
    }
    citizenships.push({
      name: country.name,
      alpha_2: country.code
    })
  }

  return { citizenshipsCA, citizenshipsExCA: citizenships }
}

function _getSIAddress (btrBodsAddress: BodsBtrAddressI) {
  const country: BtrCountryI = {
    name: btrBodsAddress.countryName,
    alpha_2: btrBodsAddress.country
  }
  const address: BtrAddressI = {
    line1: btrBodsAddress.street,
    line2: btrBodsAddress.streetAdditional,
    city: btrBodsAddress.city,
    region: btrBodsAddress.region,
    postalCode: btrBodsAddress.postalCode,
    locationDescription: btrBodsAddress.locationDescription,
    country
  }
  return address
}

function _getTaxNumber (btrBodsPerson: BtrBodsPersonI) {
  const taxIdentifierCa =
    btrBodsPerson.identifiers.find(identifier =>
      identifier.scheme === 'CAN-TAXID' && identifier.schemeName === 'ITN'
    )
  return taxIdentifierCa?.id || undefined
}

const _getSiPerson = (btrBodsPerson: BtrBodsPersonI): ProfileI => {
  const { citizenshipsCA, citizenshipsExCA } = _getCitizenships(btrBodsPerson)

  return {
    fullName: _getSiName(btrBodsPerson, BodsNameTypeE.INDIVIDUAL),
    preferredName: _getSiName(btrBodsPerson, BodsNameTypeE.ALTERNATIVE),
    address: btrBodsPerson.addresses ? _getSIAddress(btrBodsPerson.addresses[0]) : {},
    competency: {
      decisionMaking: btrBodsPerson.decisionMaking,
      financialAffairs: btrBodsPerson.financialAffairs
    },
    birthDate: btrBodsPerson.birthDate,
    citizenshipCA: citizenshipsCA,
    citizenshipsExCA,
    email: btrBodsPerson.email,
    hasTaxNumber: btrBodsPerson.hasTaxNumber,
    taxNumber: _getTaxNumber(btrBodsPerson),
    isTaxResident: !!(btrBodsPerson.taxResidencies.find(country => country.code === 'CA'))
  }
}

// const _getMaxInterestValue = (oocs: BtrBodsOwnershipOrControlI, interestType: BodsInterestTypeE): number => {
//   let max = 0

//   let maxCalc = (oldValue: number, newValue: number): number => oldValue + newValue

//   if (oocs.source?.description === BtrSourceDescriptionProvidedByBtrGovBC) {
//     maxCalc = (currentValue: number, newValue: number): number => {
//       return Math.max(currentValue, newValue)
//     }
//   }

//   for (const interest of oocs.interests) {
//     if (interest.type === interestType) {
//       max = maxCalc(max,
//         interest.share?.exact ||
//         interest.share?.maximum ||
//         interest.share?.minimum ||
//         0
//       )
//     }
//   }

//   return max > 100 ? 100 : max
// }

const _getPercentageRange = (oocs: BtrBodsOwnershipOrControlI, interestType: BodsInterestTypeE): PercentageRangeE => {
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
    range = PercentageRangeE.BETWEEN_25_AND_50
  } else if (min === 50 && max === 75) {
    range = PercentageRangeE.BETWEEN_50_AND_75
  } else if (min === 75 && max === 100) {
    range = PercentageRangeE.MORE_THAN_75
  }

  return range
}

const isControlType = (oocs: BtrBodsOwnershipOrControlI, details: string) => {
  return !!oocs.interests.find(interest => interest.details === details)
}

const _getControlDirector = (oocs: BtrBodsOwnershipOrControlI): ControlOfDirectorsI => {
  // todo: decide how to convert non BTR ones to our UI display; if we want at all // same as shares and votes
  return {
    directControl: isControlType(oocs, 'controlType.directors.directControl'),
    inConcertControl: isControlType(oocs, 'controlType.directors.inConcertControl'),
    indirectControl: isControlType(oocs, 'controlType.directors.indirectControl'),
    significantInfluence: isControlType(oocs, 'controlType.directors.significantInfluence')
  }
}

const _getControlSharesVotes = (oocs: BtrBodsOwnershipOrControlI): ControlOfSharesI => {
  // todo: decide how to convert non BTR ones to our UI display; if we want at all // same as directors
  return {
    beneficialOwner: isControlType(oocs, 'controlType.sharesOrVotes.beneficialOwner'),
    inConcertControl: isControlType(oocs, 'controlType.sharesOrVotes.inConcertControl'),
    indirectControl: isControlType(oocs, 'controlType.sharesOrVotes.indirectControl'),
    registeredOwner: isControlType(oocs, 'controlType.sharesOrVotes.registeredOwner')
  }
}

function _getControlOther (oocs: BtrBodsOwnershipOrControlI) {
  const other = oocs.interests.find(interest => interest.type === BodsInterestTypeE.OTHER_INFLUENCE_OR_CONTROL)
  return other?.details || ''
}

const _getSi = (person: BtrBodsPersonI, oocs: BtrBodsOwnershipOrControlI): SignificantIndividualI => {
  const votes = _getPercentageRange(oocs, BodsInterestTypeE.VOTING_RIGHTS)
  const shares = _getPercentageRange(oocs, BodsInterestTypeE.SHAREHOLDING)

  return {
    controlType: {
      directors: _getControlDirector(oocs),
      sharesVotes: _getControlSharesVotes(oocs),
      other: _getControlOther(oocs)
    },
    externalInfluence: person.externalInfluence || ExternalInfluenceE.NO_EXTERNAL_INFLUENCE,
    missingInfoReason: person.missingInfoReason,
    percentOfShares: shares,
    percentOfVotes: votes,
    profile: _getSiPerson(person),
    startDate: person.statementDate,
    uuid: person.statementID
  }
}

export const getSIsFromBtrBodsSubmission = (submission: BtrFilingI): SignificantIndividualI[] => {
  const sis: SignificantIndividualI[] = []

  for (const person of submission.personStatements) {
    const oocs = _findOwnershipOrControlStatement(submission, person.statementID)
    if (person && oocs) {
      sis.push(_getSi(person, oocs))
    }
  }

  return sis
}
