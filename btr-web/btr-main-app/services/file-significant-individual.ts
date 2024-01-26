import { v4 as UUIDv4 } from 'uuid'

import SiToBtrBodsConverters from '~/utils/btr-bods/si-to-btr-bods-converters'

import { SignificantIndividualFilingI } from '~/interfaces/significant-individual-filing-i'
import { IdAsNumberI } from '~/interfaces/common-ids-i'
import { BtrBodsEntityI } from '~/interfaces/btr-bods/btr-bods-entity-i'
import { BtrFilingI } from '~/interfaces/btr-bods/btr-filing-i'
import { BodsEntityTypesE, BodsStatementTypeE } from '~/enums/btr-bods-e'
import {
  BtrBodsBcrosPublicationDetails,
  BtrBodsPublishers,
  BtrBodsSources
} from '~/utils/btr-bods/btr-bods-implementations'
import { BtrBodsOwnershipOrControlI } from '~/interfaces/btr-bods/btr-bods-ownership-or-control-i'
import { BtrBodsPersonI } from '~/interfaces/btr-bods/btr-bods-person-i'

const constructBtrApiURL = () => {
  const runtimeConfig = useRuntimeConfig()
  const btrApiURL = runtimeConfig.public.btrApiURL
  return `${btrApiURL}`
}

const convertPercentsToNumber = (sif: SignificantIndividualFilingI) => {
  for (const si of sif.significantIndividuals) {
    si.percentOfShares = parseFloat(si.percentOfShares.toString()) || 0
    si.percentOfVotes = parseFloat(si.percentOfVotes.toString()) || 0
  }
  return sif
}

function getCurrentBusinessAsBtrBodsEntityI () {
  const businessStore = useBcrosBusiness()
  const currentBusiness = businessStore.currentBusiness

  const today = new Date()
  const isoDateString = today.toISOString().substring(0, 10)

  const source = BtrBodsSources.OFFICIAL_AND_VERIFIED
  source.retrievedAt = today.toISOString()

  const b: BtrBodsEntityI = {
    entityType: BodsEntityTypesE.LEGAL_ENTITY,
    identifiers: [],
    isComponent: false,
    publicationDetails: {
      bodsVersion: '0.3',
      publicationDate: isoDateString,
      publisher: BtrBodsPublishers.BCROS
    },
    source,
    statementDate: isoDateString, // todo: load existing business entity and add bods statements
    statementID: UUIDv4(), // todo: load existing business entity and add bods statements
    statementType: BodsStatementTypeE.ENTITY_STATEMENT,
    name: currentBusiness.legalName
  }

  return b
}

const getPersonAndOwnershipAndControlStatements = (sif: SignificantIndividualFilingI): {
  ownershipOrControlStatements: BtrBodsOwnershipOrControlI[], personStatements: BtrBodsPersonI[]
} => {
  const ret: {
    ownershipOrControlStatements: BtrBodsOwnershipOrControlI[], personStatements: BtrBodsPersonI[]
  } = {
    ownershipOrControlStatements: [],
    personStatements: []
  }

  const today = new Date()
  const isoDateString = today.toISOString().substring(0, 10)

  for (const si of sif.significantIndividuals) {
    const source = BtrBodsSources.SELF_DECLARATION
    source.assertedBy = [{ name: si.profile.fullName }]

    const personStatement: BtrBodsPersonI = {
      placeOfResidence: si.profile.address,
      addresses: [si.profile.address],
      birthDate: si.profile.birthDate,
      email: si.profile.email,
      hasTaxNumber: si.profile.hasTaxNumber,
      identifiers: SiToBtrBodsConverters.getBodsIdentifiersFromSi(si),
      isComponent: false,
      names: SiToBtrBodsConverters.getBodsNamesFromSi(si),
      nationalities: SiToBtrBodsConverters.getBodsNationalitiesFromSi(si),
      isPermanentResidentCa: si.profile.citizenshipCA === CitizenshipTypeE.PR,
      personType: SiToBtrBodsConverters.getPersonType(si),
      publicationDetails: BtrBodsBcrosPublicationDetails(),
      source,
      statementDate: isoDateString,
      statementType: BodsStatementTypeE.PERSON_STATEMENT,
      taxResidencies: SiToBtrBodsConverters.getTaxResidenciesFromSi(si),
      statementID: UUIDv4()
    }

    const oocs: BtrBodsOwnershipOrControlI = {
      statementID: UUIDv4(),
      interestedParty: { describedByPersonStatement: personStatement.statementID },
      interests: SiToBtrBodsConverters.getInterests(si),
      isComponent: false,
      publicationDetails: BtrBodsBcrosPublicationDetails(),
      source,
      statementDate: isoDateString,
      statementType: BodsStatementTypeE.OWNERSHIP_OR_CONTROL_STATEMENT,
      subject: { describedByEntityStatement: '' }

    }

    ret.personStatements.push(personStatement)
    ret.ownershipOrControlStatements.push(oocs)
  }

  return ret
}

const convertToBtrBodsForSubmit = (sif: SignificantIndividualFilingI): BtrFilingI => {
  const businessDetails = getCurrentBusinessAsBtrBodsEntityI()

  const { ownershipOrControlStatements, personStatements } = getPersonAndOwnershipAndControlStatements(sif)

  return {
    businessIdentifier: sif.businessIdentifier,
    effectiveDate: sif.effectiveDate,
    entityStatement: businessDetails,
    ownershipOrControlStatements,
    personStatements
  }
}

const submitSignificantIndividualFiling = async (sif: SignificantIndividualFilingI) => {
  sif = convertPercentsToNumber(sif)
  const submitData = convertToBtrBodsForSubmit(sif)

  const url = constructBtrApiURL() + '/plots'
  const { data, error } = await useFetchBcros<IdAsNumberI>(url,
    {
      method: 'POST',
      body: submitData,
      headers: { 'Content-Type': 'application/json' }
    })

  return { data: data.value, error: error.value }
}

const getCurrentOwners = async (businessIdentifier: string) => { // @ts-ignore
  const url = `${constructBtrApiURL()}/owners/${businessIdentifier}`
  const { data, error } =
    await useFetchBcros<SignificantIndividualI[]>(url)

  // eslint-disable-next-line no-console
  console.log(data, error)
  // todo: fixme: will be updated in next PR; with ticket #19211
  // https://github.com/bcgov/entity/issues/19211
  // if (data.value) {
  //   for (const si of data.value) {
  //     si.percentOfShares = si.percentOfShares ? si.percentOfShares.toString() : '0'
  //     si.percentOfVotes = si.percentOfVotes ? si.percentOfVotes.toString() : '0'
  //     si.profile.citizenshipsExCA = si.profile.citizenshipsExCA || []
  //   }
  // }
  // return { data: data.value, error: error.value }
  return { data: [], error: undefined }
}

export default {
  getPersonAndOwnershipAndControlStatements,
  submitSignificantIndividualFiling,
  getCurrentOwners
}
