import { BodsCountryI, BodsIdentifierI, BodsInterestI, BodsNameI } from '~/interfaces/btr-bods/components-i'
import {
  BodsInterestDirectOrIndirectTypeI,
  BodsInterestTypeE,
  BodsNameTypeE,
  BodsPersonTypeE
} from '~/enums/btr-bods-e'
import { SignificantIndividualI } from '~/interfaces/significant-individual-i'
import { BtrBodsSources } from '~/utils/btr-bods/btr-bods-implementations'

const getBodsNamesFromSi = (si: SignificantIndividualI) => {
  const names: BodsNameI[] = [
    {
      fullName: si.profile.fullName,
      type: BodsNameTypeE.INDIVIDUAL
    }
  ]

  if (si.profile.preferredName) {
    names.push({
      fullName: si.profile.preferredName,
      type: BodsNameTypeE.ALTERNATIVE
    })
  }
  return names
}

const getBodsIdentifiersFromSi = (si: SignificantIndividualI) => {
  const identifiers: BodsIdentifierI[] = []
  if (si.profile.taxNumber) {
    identifiers.push({
      id: si.profile.taxNumber,
      scheme: 'CAN-TAXID',
      schemeName: 'ITN'
    })
  }
  return identifiers
}

const getPersonType = (si: SignificantIndividualI): BodsPersonTypeE => {
  // future: when we have requirements to hide person details we can use
  // BodsPersonTypeE.ANONYMOUS_PERSON
  return BodsPersonTypeE.KNOWN_PERSON
}

const _createInterestDirectors = (
  si: SignificantIndividualI,
  directOrIndirect: BodsInterestDirectOrIndirectTypeI,
  flagName: string
) => {
  return {
    type: BodsInterestTypeE.APPOINTMENT_OF_BOARD,
    directOrIndirect,
    details: `controlType.directors.${flagName}`,
    startDate: si.startDate,
    endDate: si.endDate
  }
}

const _getDirectorsInterests = (si: SignificantIndividualI) => {
  const interests: BodsInterestI[] = []

  if (si.controlType.directors.directControl) {
    interests.push(
      _createInterestDirectors(si, BodsInterestDirectOrIndirectTypeI.DIRECT, 'directControl'))
  }
  if (si.controlType.directors.inConcertControl) {
    interests.push(
      _createInterestDirectors(si, BodsInterestDirectOrIndirectTypeI.INDIRECT, 'inConcertControl'))
  }
  if (si.controlType.directors.indirectControl) {
    interests.push(
      _createInterestDirectors(si, BodsInterestDirectOrIndirectTypeI.INDIRECT, 'indirectControl'))
  }
  if (si.controlType.directors.significantInfluence) {
    interests.push(
      _createInterestDirectors(si, BodsInterestDirectOrIndirectTypeI.UNKNOWN, 'significantInfluence'))
  }
  return interests
}

const _createInterestSharesVotes = (
  si: SignificantIndividualI,
  directOrIndirect: BodsInterestDirectOrIndirectTypeI,
  flagName: string
): BodsInterestI => {
  return {
    directOrIndirect,
    details: `controlType.directors.${flagName}`,
    startDate: si.startDate,
    endDate: si.endDate
  }
}
const _addVotes = (interest: BodsInterestI, maximum: number, sharesOrVotes: BodsInterestTypeE) => {
  interest.share = {
    maximum,
    exclusiveMaximum: false
  }
  interest.type = sharesOrVotes
}

const _getSharesVotesInterests = (si: SignificantIndividualI) => {
  const interests: BodsInterestI[] = []

  if (si.controlType.sharesVotes.registeredOwner) {
    const interest = _createInterestSharesVotes(si, BodsInterestDirectOrIndirectTypeI.DIRECT, 'registeredOwner')
    if (si.percentOfVotes) {
      _addVotes(interest, parseFloat(si.percentOfVotes as string), BodsInterestTypeE.VOTING_RIGHTS)
    }
    if (si.percentOfShares) {
      _addVotes(interest, parseFloat(si.percentOfShares as string), BodsInterestTypeE.SHAREHOLDING)
    }
    interests.push(interest)
  }

  if (si.controlType.sharesVotes.indirectControl) {
    const interest = _createInterestSharesVotes(si, BodsInterestDirectOrIndirectTypeI.INDIRECT, 'indirectControl')
    if (si.percentOfVotes) {
      _addVotes(interest, parseFloat(si.percentOfVotes as string), BodsInterestTypeE.VOTING_RIGHTS)
    }
    if (si.percentOfShares) {
      _addVotes(interest, parseFloat(si.percentOfShares as string), BodsInterestTypeE.SHAREHOLDING)
    }
    interests.push(interest)
  }

  if (si.controlType.sharesVotes.inConcertControl) {
    const interest = _createInterestSharesVotes(si, BodsInterestDirectOrIndirectTypeI.INDIRECT, 'inConcertControl')
    if (si.percentOfVotes) {
      _addVotes(interest, parseFloat(si.percentOfVotes as string), BodsInterestTypeE.VOTING_RIGHTS)
    }
    if (si.percentOfShares) {
      _addVotes(interest, parseFloat(si.percentOfShares as string), BodsInterestTypeE.SHAREHOLDING)
    }
    interests.push(interest)
  }

  if (si.controlType.sharesVotes.beneficialOwner) {
    const interest = _createInterestSharesVotes(si, BodsInterestDirectOrIndirectTypeI.INDIRECT, 'beneficialOwner')
    if (si.percentOfVotes) {
      _addVotes(interest, parseFloat(si.percentOfVotes as string), BodsInterestTypeE.VOTING_RIGHTS)
    }
    if (si.percentOfShares) {
      _addVotes(interest, parseFloat(si.percentOfShares as string), BodsInterestTypeE.SHAREHOLDING)
    }
    interests.push(interest)
  }
  return interests
}

const getInterests = (si: SignificantIndividualI): BodsInterestI[] => {
  let interests: BodsInterestI[] = []

  interests = interests.concat(_getDirectorsInterests(si))
  interests = interests.concat(_getSharesVotesInterests(si))
  if (si.controlType.other) {
    interests.push({})
  }
  return interests
}

const getBodsNationalitiesFromSi = (si: SignificantIndividualI): BodsCountryI[] => {
  const citizenships: BodsCountryI[] = []
  if (si.profile.citizenshipCA === CitizenshipTypeE.CITIZEN) {
    citizenships.push({ name: 'Canada', code: 'CA' })
  } else if (si.profile.citizenshipCA === CitizenshipTypeE.PR) {
    // if PR do not add any citizenship
  } else {
    for (const btrCountry of si.profile.citizenshipsExCA) {
      citizenships.push({ name: btrCountry.name, code: btrCountry.alpha_2 })
    }
  }
  return citizenships
}

export default {
  getBodsNamesFromSi,
  getBodsIdentifiersFromSi,
  getInterests,
  getBodsNationalitiesFromSi,
  getPersonType
}
