import { v4 as UUIDv4 } from 'uuid'

import SiSchemaToBtrBodsConverters from '../utils/btr-bods/si-schema-to-btr-bods-converters'
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
import {
  getSiControlConnectionsFromBodsSubmission,
  getSIsFromBtrBodsSubmission
} from '~/utils/btr-bods/bods-to-si-schema-converters'
import { FilingActionE } from '#imports'

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

  for (const siSchema of sif.significantIndividuals) {
    const source = BtrBodsSources.SELF_DECLARATION
    source.assertedBy = [{ name: siSchema.name.fullName }]
    source.description = BtrSourceDescriptionProvidedByBtrGovBC
    const address = SiSchemaToBtrBodsConverters.getBodsAddressFromSi(siSchema)
    const identifiers = SiSchemaToBtrBodsConverters.getBodsIdentifiersFromSi(siSchema)
    const hasTaxNumber = !!siSchema.tax.hasTaxNumber
    const names = SiSchemaToBtrBodsConverters.getBodsNamesFromSi(siSchema)

    // countries stuff
    const nationalities = SiSchemaToBtrBodsConverters.getBodsNationalitiesFromSi(siSchema)
    const isPermanentResidentCa = siSchema.citizenships.findIndex(country => country.alpha_2 === 'CA_PR') !== -1
    const taxResidencies =  SiSchemaToBtrBodsConverters.getTaxResidenciesFromSi(siSchema)

    const personStatement: BtrBodsPersonI = {
      missingInfoReason: siSchema.missingInfoReason,
      placeOfResidence: address,
      addresses: [address],
      birthDate: siSchema.birthDate,
      phoneNumber: siSchema.phoneNumber,
      email: siSchema.email,
      hasTaxNumber: hasTaxNumber,
      identifiers: identifiers,
      isComponent: false,
      names: names,
      nationalities: nationalities,
      isPermanentResidentCa: isPermanentResidentCa,
      taxResidencies: taxResidencies,
      determinationOfIncapacity: siSchema.determinationOfIncapacity,

      // common, always existing
      personType: SiSchemaToBtrBodsConverters.getPersonType(siSchema),
      publicationDetails: BtrBodsBcrosPublicationDetails(),
      source,
      statementDate: todayIsoDateString(),
      statementType: BodsStatementTypeE.PERSON_STATEMENT,

      statementID: UUIDv4(), // todo: fixme we should update schema only if there are changes to the schema itself....
      uuid: siSchema.uuid
    }

    const oocs: BtrBodsOwnershipOrControlI = {
      statementID: UUIDv4(),
      interestedParty: { describedByPersonStatement: personStatement.statementID },
      interests: SiSchemaToBtrBodsConverters.getInterests(siSchema),
      isComponent: false,
      publicationDetails: BtrBodsBcrosPublicationDetails(),
      source,
      statementDate: todayIsoDateString(),
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

  // note that the api will receive empty strings and then fail validation
  // as empty string is not null and not allowed on those fields.
  // therefore this removes the empty strings to avoid that problem
  for (const personS of personStatements) {
    const k = Object.keys(personS)
    for (let i = 0; i < k.length; i++) {
      if ((typeof personS[k[i]] === 'string') && (personS[k[i]] === '')) {
        delete personS[k[i]]
      }
    }
  }

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
    significantIndividuals: sif.significantIndividuals.filter(
      si => si.ui.actions?.includes(FilingActionE.ADD) ||
        si.ui.actions?.includes(FilingActionE.CEASE) ||
        si.ui.actions?.includes(FilingActionE.EDIT)
    ),
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

const getBtrFiling = async (businessIdentifier: string) => {
  const url = `${constructBtrApiURL()}/plots/entity/${businessIdentifier}`
  const { data, error } = await useFetchBcros<{ payload: BtrFilingI }>(url)
  return { data: data?.value || null, error }
}

const getCurrentOwners = (btrFiling: BtrFilingI) => {
  return getSIsFromBtrBodsSubmission(btrFiling)
}

const getCurrentControlConnections = (btrFiling: BtrFilingI) => {
  return getSiControlConnectionsFromBodsSubmission(btrFiling)
}

export default {
  getPersonAndOwnershipAndControlStatements,
  submitSignificantIndividualFiling,
  getBtrFiling,
  getCurrentOwners,
  getCurrentControlConnections
}
