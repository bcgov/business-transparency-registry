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
  BtrBodsSources,
  BtrSourceDescriptionProvidedByBtrGovBC
} from '~/utils/btr-bods/btr-bods-implementations'
import { BtrBodsOwnershipOrControlI } from '~/interfaces/btr-bods/btr-bods-ownership-or-control-i'
import { BtrBodsPersonI } from '~/interfaces/btr-bods/btr-bods-person-i'
import { getSIsFromBtrBodsSubmission } from '~/utils/btr-bods/bods-to-si-converters'

const constructBtrApiURL = () => {
  const runtimeConfig = useRuntimeConfig()
  const btrApiURL = runtimeConfig.public.btrApiURL
  return `${btrApiURL}`
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

  for (const si of sif.significantIndividuals) {
    const source = BtrBodsSources.SELF_DECLARATION
    source.assertedBy = [{ name: si.profile.fullName }]
    source.description = BtrSourceDescriptionProvidedByBtrGovBC

    const address = SiToBtrBodsConverters.getBodsAddressFromSi(si)
    const personStatement: BtrBodsPersonI = {
      missingInfoReason: si.missingInfoReason,
      placeOfResidence: address,
      addresses: [address],
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
      statementDate: si.startDate,
      statementType: BodsStatementTypeE.PERSON_STATEMENT,
      taxResidencies: SiToBtrBodsConverters.getTaxResidenciesFromSi(si),
      statementID: si.uuid || UUIDv4()
    }

    const oocs: BtrBodsOwnershipOrControlI = {
      statementID: UUIDv4(),
      interestedParty: { describedByPersonStatement: personStatement.statementID },
      interests: SiToBtrBodsConverters.getInterests(si),
      isComponent: false,
      publicationDetails: BtrBodsBcrosPublicationDetails(),
      source,
      statementDate: si.startDate,
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
    noSignificantIndividualsExist: sif.noSignificantIndividualsExist,
    businessIdentifier: sif.businessIdentifier,
    effectiveDate: sif.effectiveDate,
    entityStatement: businessDetails,
    ownershipOrControlStatements,
    personStatements
  }
}

const submitSignificantIndividualFiling = async (sif: SignificantIndividualFilingI) => {
  // sif = convertPercentsToNumber(sif)
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
  const url = `${constructBtrApiURL()}/plots/entity/${businessIdentifier}`
  const { data, error } =
    await useFetchBcros<{ payload: BtrFilingI }>(url)

  if (data.value?.payload) {
    return { data: getSIsFromBtrBodsSubmission(data.value.payload), error: error.value }
  }

  return { data: data.value, error: error.value }
}

export default {
  getPersonAndOwnershipAndControlStatements,
  submitSignificantIndividualFiling,
  getCurrentOwners
}
