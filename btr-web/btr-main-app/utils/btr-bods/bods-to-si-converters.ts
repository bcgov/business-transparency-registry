import { BodsInterestTypeE, BodsNameTypeE } from '~/enums/btr-bods-e'
import { SignificantIndividualI } from '~/interfaces/significant-individual-i'
import { BtrFilingI } from '~/interfaces/btr-bods/btr-filing-i'
import { BtrBodsOwnershipOrControlI } from '~/interfaces/btr-bods/btr-bods-ownership-or-control-i'
import { BtrBodsPersonI } from '~/interfaces/btr-bods/btr-bods-person-i'
import { BtrCountryI } from '../../../btr-common-components/interfaces/btr-address-i'
import { CitizenshipTypeE } from '../../../btr-common-components/enums/citizenship-type-e'
import { BtrSourceDescriptionProvidedByBtrGovBC } from '~/utils/btr-bods/btr-bods-implementations'
import { ControlOfDirectorsI } from '~/interfaces/control-of-directors-i'
import { ControlOfSharesI } from '~/interfaces/control-of-shares-i'


const _find_ownership_or_control_statement = (submission: BtrFilingI, person_statement_id: string): BtrBodsOwnershipOrControlI | null => {
  for (const oocs of submission.ownershipOrControlStatements) {
    if (oocs.interestedParty.describedByPersonStatement === person_statement_id) {
      return oocs
    }
  }
  return null
}


const _getSiName = (btrBodsPerson: BtrBodsPersonI, nameType: BodsNameTypeE): string => {
  let bodsName = btrBodsPerson.names.find((name) => name.type === nameType)
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

  return { citizenshipsCA: citizenshipsCA, citizenshipsExCA: citizenships }
}

function _getTaxNumber (btrBodsPerson: BtrBodsPersonI) {
  const taxIdentifierCa =
    btrBodsPerson.identifiers.find(identifier =>
      identifier.scheme === 'CAN-TAXID' && identifier.schemeName === 'ITN'
    )
  return taxIdentifierCa?.id || undefined
}

const _get_si_person = (btrBodsPerson: BtrBodsPersonI): ProfileI => {
  const { citizenshipsCA, citizenshipsExCA } = _getCitizenships(btrBodsPerson)

  return {
    fullName: _getSiName(btrBodsPerson, BodsNameTypeE.INDIVIDUAL),
    preferredName: _getSiName(btrBodsPerson, BodsNameTypeE.ALTERNATIVE),
    address: btrBodsPerson.addresses ? btrBodsPerson.addresses[0] : {},
    competency: {
      decisionMaking: btrBodsPerson.decisionMaking,
      financialAffairs: btrBodsPerson.financialAffairs
    },
    birthDate: btrBodsPerson.birthDate,
    citizenshipCA: citizenshipsCA,
    citizenshipsExCA: citizenshipsExCA,
    email: btrBodsPerson.email,
    hasTaxNumber: btrBodsPerson.hasTaxNumber,
    taxNumber: _getTaxNumber(btrBodsPerson),
    isTaxResident: !!(btrBodsPerson.taxResidencies.find((country) => country.code === 'CA'))
  }
}

const _get_max = (oocs: BtrBodsOwnershipOrControlI, interestType: BodsInterestTypeE): number => {
  let max = 0

  let maxCalc = (oldValue: number, newValue: number): number => oldValue + newValue

  if (oocs.source.description === BtrSourceDescriptionProvidedByBtrGovBC) {
    maxCalc = (currentValue: number, newValue: number): number => {
      return Math.max(currentValue, newValue)
    }
  }

  for (const interest of oocs.interests) {
    if (interest.type === interestType) {
      max = maxCalc(max,
        interest.share?.exact
        || interest.share?.maximum
        || interest.share?.minimum
        || 0
      )
    }
  }

  return max > 100 ? 100 : max
}


const _getControlDirector = (oocs: BtrBodsOwnershipOrControlI): ControlOfDirectorsI => {
  //todo: decide how to convert non BTR ones to our UI display; if we want at all // same as shares and votes
  return {
    directControl: !!oocs.interests.find(interest => interest.details === 'controlType.directors.directControl'),
    inConcertControl: !!oocs.interests.find(interest => interest.details === 'controlType.directors.inConcertControl'),
    indirectControl: !!oocs.interests.find(interest => interest.details === 'controlType.directors.indirectControl'),
    significantInfluence: !!oocs.interests.find(interest => interest.details === 'controlType.directors.significantInfluence')
  }
}

const _getControlSharesVotes = (oocs: BtrBodsOwnershipOrControlI): ControlOfSharesI => {
  //todo: decide how to convert non BTR ones to our UI display; if we want at all // same as directors
  return {
    beneficialOwner: !!oocs.interests.find(interest => interest.details === 'controlType.sharesOrVotes.beneficialOwner'),
    inConcertControl: !!oocs.interests.find(interest => interest.details === 'controlType.sharesOrVotes.inConcertControl'),
    indirectControl: !!oocs.interests.find(interest => interest.details === 'controlType.sharesOrVotes.indirectControl'),
    registeredOwner: !!oocs.interests.find(interest => interest.details === 'controlType.sharesOrVotes.registeredOwner')
  }
}

function _getControlOther (oocs: BtrBodsOwnershipOrControlI) {
  const other = oocs.interests.find(interest => interest.type === BodsInterestTypeE.OTHER_INFLUENCE_OR_CONTROL)
  return other?.details || ''
}

const _get_si = (person: BtrBodsPersonI, oocs: BtrBodsOwnershipOrControlI, startDate: string): SignificantIndividualI => {
  const votes = _get_max(oocs, BodsInterestTypeE.VOTING_RIGHTS)
  const shares = _get_max(oocs, BodsInterestTypeE.SHAREHOLDING)

  return {
    controlType: {
      directors: _getControlDirector(oocs),
      sharesVotes: _getControlSharesVotes(oocs),
      other: _getControlOther(oocs)
    },
    missingInfoReason: person.missingInfoReason,
    percentOfShares: shares,
    percentOfVotes: votes,
    profile: _get_si_person(person),
    startDate: startDate,
    uuid: person.statementID
  }
}

export const getSIsFromBtrBodsSubmission = (submission: BtrFilingI): SignificantIndividualI[] => {
  const sis: SignificantIndividualI[] = []

  for (const person of submission.personStatements) {
    const oocs = _find_ownership_or_control_statement(submission, person.statementID)
    if (person && oocs) {
      sis.push(_get_si(person, oocs, submission.effectiveDate));
    }
  }

  return sis
}
