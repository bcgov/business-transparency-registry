import { v4 as UUIDv4 } from 'uuid'

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
import { SiSchemaType } from '~/utils/si-schema/definitions'
import { getSIsFromBtrBodsSubmission } from '~/utils/btr-bods/bods-to-si-schema-converters'
import { FetchError } from 'ofetch'
import { FilingActionE } from '#imports'
import SiSchemaToBtrBodsConverters from '~/utils/btr-bods/si-schema-to-btr-bods-converters'

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

  const today = new Date()
  const isoDateString = today.toISOString().substring(0, 10)

  for (const si of sif.significantIndividuals) {
    const source = BtrBodsSources.SELF_DECLARATION
    source.assertedBy = [{ name: si.name.fullName }]
    source.description = BtrSourceDescriptionProvidedByBtrGovBC
    const todayIso = (new Date()).toISOString()
    const address = SiSchemaToBtrBodsConverters.getBodsAddressFromSi(si)
    const personStatement: BtrBodsPersonI = {
      missingInfoReason: si.missingInfoReason,
      placeOfResidence: address,
      addresses: [address],
      birthDate: si.birthDate,
      email: si.email,
      hasTaxNumber: !!si.tax.hasTaxNumber,
      identifiers: SiSchemaToBtrBodsConverters.getBodsIdentifiersFromSi(si),
      isComponent: false,
      names: SiSchemaToBtrBodsConverters.getBodsNamesFromSi(si),
      nationalities: SiSchemaToBtrBodsConverters.getBodsNationalitiesFromSi(si),
      isPermanentResidentCa: si.citizenships.findIndex(country => country.alpha_2 === 'CA_PR') !== -1,
      personType: SiSchemaToBtrBodsConverters.getPersonType(si),
      publicationDetails: BtrBodsBcrosPublicationDetails(),
      source,
      statementDate: isoDateString,
      statementType: BodsStatementTypeE.PERSON_STATEMENT,
      taxResidencies: SiSchemaToBtrBodsConverters.getTaxResidenciesFromSi(si),
      statementID: si.ui.uuid || UUIDv4()
    }

    const oocs: BtrBodsOwnershipOrControlI = {
      statementID: UUIDv4(),
      interestedParty: { describedByPersonStatement: personStatement.statementID },
      interests: SiSchemaToBtrBodsConverters.getInterests(si),
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
  //todo: fixme: with new changes
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
  const submitSif: SignificantIndividualFilingI = {
    certified: sif.certified,
    noSignificantIndividualsExist: sif.noSignificantIndividualsExist,
    businessIdentifier: sif.businessIdentifier,
    significantIndividuals: sif.significantIndividuals.filter(si => si.ui.action !== FilingActionE.REMOVE),
    effectiveDate: sif.effectiveDate,
    folioNumber: sif.folioNumber
  }
  const submitData = convertToBtrBodsForSubmit(submitSif)

  const url = constructBtrApiURL() + '/plots'
  const { data, error } = await useFetchBcros<IdAsNumberI>(url,
    {
      method: 'POST',
      body: submitData,
      headers: { 'Content-Type': 'application/json' }
    })

  return { data: data.value, error: error.value }
}

const getCurrentOwners =
  async (businessIdentifier: string): Promise<{ data: SiSchemaType[] | null, error: FetchError<any> | null }> => {
    const url = `${constructBtrApiURL()}/plots/entity/${businessIdentifier}`
    const { data, error } =
      await useFetchBcros<{ payload: BtrFilingI }>(url)

    if (data.value?.payload) {
      return { data: getSIsFromBtrBodsSubmission(data.value.payload), error: error.value }
    }

    return { data: null, error: error.value }
  }

export default {
  getPersonAndOwnershipAndControlStatements,
  submitSignificantIndividualFiling,
  getCurrentOwners
}
