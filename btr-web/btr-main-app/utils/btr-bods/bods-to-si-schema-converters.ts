import { BodsInterestTypeE, BodsNameTypeE, ControlOfSharesDetailsE } from '~/enums/btr-bods-e'
import { BtrFilingI } from '~/interfaces/btr-bods/btr-filing-i'
import { BtrBodsOwnershipOrControlI } from '~/interfaces/btr-bods/btr-bods-ownership-or-control-i'
import { BtrBodsPersonI } from '~/interfaces/btr-bods/btr-bods-person-i'
import { BodsBtrAddressI, BodsBtrAddressTypeE, BodsInterestI } from '~/interfaces/btr-bods/components-i'
import {
  AddressSchemaType,
  CountrySchemaType,
  CitizenshipSchemaType,
  SiSchemaType, StartEndDateGroupSchemaType, ConnectedInvidualSchemaType
} from '~/utils/si-schema/definitions'
import { getEmptyAddress } from '~/utils/si-schema/defaults'
import { JointlyOrInConcertConnectionsI } from '~/interfaces/jointly-or-in-concert'

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

const _getCitizenships = (btrBodsPerson: BtrBodsPersonI): CitizenshipSchemaType => {
  const nationalities: CountrySchemaType[] = []
  let citizenshipType: CitizenshipTypeE

  // add PR info to the array since it is not included in btrBodsPerson.nationalities
  if (btrBodsPerson.isPermanentResidentCa) {
    nationalities.push({
      name: 'Canada (Permanent Resident)',
      alpha_2: 'CA_PR'
    })
    citizenshipType = CitizenshipTypeE.PERMANENT_RESIDENT
  } else if (btrBodsPerson.nationalities?.find(country => country.code === 'CA')) {
    nationalities.push({
      name: 'Canada (Citizen)',
      alpha_2: 'CA'
    })
    citizenshipType = CitizenshipTypeE.CITIZEN
  } else {
    for (const country of btrBodsPerson.nationalities || []) {
      nationalities.push({
        name: country.name,
        alpha_2: country.code
      })
    }
    citizenshipType = CitizenshipTypeE.OTHER
  }

  return { nationalities, citizenshipType }
}

function _getSIAddress (btrBodsAddress: BodsBtrAddressI | undefined): AddressSchemaType {
  if (!btrBodsAddress) {
    return getEmptyAddress()
  }
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
  const identifiers = btrBodsPerson.identifiers || []
  const taxIdentifierCa =
    identifiers.find(identifier =>
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

const getConnectedIndividuals = (oocs: BtrBodsOwnershipOrControlI, details: string): ConnectedInvidualSchemaType[] => {
  const interest: BodsInterestI | undefined = oocs.interests.find(interest => interest.details === details)
  return (interest && interest.connectedIndividuals) ? interest.connectedIndividuals : []
}

function _getEffectiveDates (oocs: BtrBodsOwnershipOrControlI) {
  const effectiveDates: StartEndDateGroupSchemaType[] = []
  for (const interest of oocs.interests) {
    const hasDates =
      effectiveDates.filter(dg => dg.startDate === (interest.startDate || '') && dg.endDate === interest.endDate)
    // if there is no effective date group with same start and end dates then add new group
    if (hasDates.length === 0) {
      effectiveDates.push({
        startDate: interest.startDate || '',
        endDate: interest.endDate
      })
    }
  }
  return effectiveDates
}

function _getTaxResidency (person: BtrBodsPersonI) {
  if (!person.taxResidencies) {
    return undefined
  }
  return !!(person.taxResidencies.find(country => country.code === 'CA'))
}

const _getResidentialAddress = (person: BtrBodsPersonI) => {
  return person.addresses?.find(a => a.type === BodsBtrAddressTypeE.PHYSICAL_ADDRESS || a.type === undefined) ||
    undefined
}

const _getSi = (
  person: BtrBodsPersonI, oocs: BtrBodsOwnershipOrControlI, businessIdentifier: string
): SiSchemaType => {
  const preferredName = _getSiName(person, BodsNameTypeE.ALTERNATIVE)

  const bodsAddress = _getResidentialAddress(person)
  const bodsMailingAddress = person.addresses?.find(a => a.type === BodsBtrAddressTypeE.MAILING_ADDRESS)

  return {
    address: _getSIAddress(bodsAddress),
    mailingAddress: {
      isDifferent: !!bodsMailingAddress,
      address: bodsMailingAddress ? _getSIAddress(bodsMailingAddress) : undefined
    },
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
    citizenships: _getCitizenships(person),
    missingInfoReason: person.missingInfoReason,
    couldNotProvideMissingInfo: person.missingInfoReason ? !!person.missingInfoReason.trim() : false,
    birthDate: person.birthDate ? person.birthDate : '',
    email: person.email,
    phoneNumber: person.phoneNumber || {},
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
    isTaxResident: _getTaxResidency(person),
    determinationOfIncapacity: person.determinationOfIncapacity || false,

    effectiveDates: _getEffectiveDates(oocs),

    uuid: person.statementID,
    ownershipStatementId: oocs.statementID,

    ui: {
      newOrUpdatedFields: []
    }
  }
}

export const getSIsFromBtrBodsSubmission = (submission: BtrFilingI): SiSchemaType[] => {
  const sis: SiSchemaType[] = []
  const businessIdentifier = submission.businessIdentifier
  for (const person of submission.personStatements) {
    // update person uuid to be the statementID generated from the backend
    person.uuid = person.statementID
    const oocs = _findOwnershipOrControlStatement(submission, person.statementID)
    if (person && oocs) {
      const si = _getSi(person, oocs, businessIdentifier)
      const fullInfo = !si.couldNotProvideMissingInfo
      if ((fullInfo) && (si.effectiveDates.filter(date => !date.endDate).length === 0)) {
        // set previously ceased SIs to historical
        si.ui.actions ??= []
        si.ui.actions.push(FilingActionE.HISTORICAL)
      }
      sis.push(si)
    }
  }
  return sis
}

export const getSiControlConnectionsFromBodsSubmission =
  (submission: BtrFilingI): Map<string, JointlyOrInConcertConnectionsI> => {
    const jointlyOrInConcertConnections: Map<string, JointlyOrInConcertConnectionsI> = new Map()

    for (const person of submission.personStatements) {
      const oocs = _findOwnershipOrControlStatement(submission, person.statementID)
      if (person && oocs) {
        const connections: JointlyOrInConcertConnectionsI = {
          sharesInConcert: getConnectedIndividuals(oocs, ControlOfSharesDetailsE.IN_CONCERT_CONTROL),
          sharesJointly: getConnectedIndividuals(oocs, ControlOfSharesDetailsE.ACTING_JOINTLY),
          votesInConcert: getConnectedIndividuals(oocs, ControlOfVotesDetailsE.IN_CONCERT_CONTROL),
          votesJointly: getConnectedIndividuals(oocs, ControlOfVotesDetailsE.ACTING_JOINTLY),
          directorsInConcert: getConnectedIndividuals(oocs, ControlOfDirectorsDetailsE.IN_CONCERT_CONTROL),
          directorsJointly: getConnectedIndividuals(oocs, ControlOfDirectorsDetailsE.ACTING_JOINTLY)
        }

        jointlyOrInConcertConnections.set(person.uuid, connections)
      }
    }
    return jointlyOrInConcertConnections
  }
