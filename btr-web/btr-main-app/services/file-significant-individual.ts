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
import { FilingActionE, InputFieldsE } from '#imports'

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
    const mailingAddress = SiSchemaToBtrBodsConverters.getBodsMailingAddressFromSi(siSchema)
    let addresses = address ? [address] : undefined
    if (mailingAddress && addresses) {
      addresses.push(mailingAddress)
    } else if (mailingAddress && !addresses) {
      addresses = [mailingAddress]
    }
    const identifiers = SiSchemaToBtrBodsConverters.getBodsIdentifiersFromSi(siSchema)
    const hasTaxNumber = hasFieldChanged(siSchema, InputFieldsE.TAX) ? !!siSchema.tax.hasTaxNumber : undefined
    const names = SiSchemaToBtrBodsConverters.getBodsNamesFromSi(siSchema)

    // countries stuff
    const nationalities = SiSchemaToBtrBodsConverters.getBodsNationalitiesFromSi(siSchema)
    const isPermanentResidentCa =
      hasFieldChanged(siSchema, InputFieldsE.CITIZENSHIPS)
        ? siSchema.citizenships.findIndex(country => country.alpha_2 === 'CA_PR') !== -1
        : undefined
    const taxResidencies = SiSchemaToBtrBodsConverters.getTaxResidenciesFromSi(siSchema)

    const personStatement: BtrBodsPersonI = {
      missingInfoReason:
        hasFieldChanged(siSchema, InputFieldsE.MISSING_INFO_REASON) ? siSchema.missingInfoReason : '',
      placeOfResidence: address,
      addresses,
      birthDate: hasFieldChanged(siSchema, InputFieldsE.BIRTH_DATE) ? siSchema.birthDate : undefined,
      phoneNumber: hasFieldChanged(siSchema, InputFieldsE.PHONE_NUMBER) ? siSchema.phoneNumber : undefined,
      email: hasFieldChanged(siSchema, InputFieldsE.EMAIL) ? siSchema.email : undefined,
      hasTaxNumber,
      identifiers,

      names,
      nationalities,
      isPermanentResidentCa,
      taxResidencies,
      determinationOfIncapacity:
        hasFieldChanged(siSchema, InputFieldsE.DETERMINATION_OF_INCAPACITY)
          ? siSchema.determinationOfIncapacity
          : undefined,
      uuid: siSchema.uuid,

      // common, part of bods
      isComponent: false,
      personType: SiSchemaToBtrBodsConverters.getPersonType(siSchema),
      publicationDetails: BtrBodsBcrosPublicationDetails(),
      source,
      statementDate: todayIsoDateString(),
      statementType: BodsStatementTypeE.PERSON_STATEMENT,
      statementID: siSchema.uuid
    }

    const oocs: BtrBodsOwnershipOrControlI = {
      statementID: siSchema.ownershipStatementId || UUIDv4(),
      interests: SiSchemaToBtrBodsConverters.getInterests(siSchema),
      interestedParty: { describedByPersonStatement: personStatement.statementID },
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

const submitSignificantIndividualFiling = async (sif: SignificantIndividualFilingI, previousSubmissionId?: number) => {
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

  let url = constructBtrApiURL() + '/plots'
  let method = 'POST'
  if (previousSubmissionId) {
    method = 'PUT'
    url += `/${previousSubmissionId}`
  }
  const { data, error } = await useFetchBcros<IdAsNumberI>(url,
    {
      method,
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
