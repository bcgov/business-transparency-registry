import { BodsPersonTypeE, BodsStatementTypeE, BodsUnspecifiedPersonDetailsTypeE } from '~/enums/btr-bods-e'
import {
  BodsBtrAddressI,
  BodsCountryI,
  BodsIdentifierI,
  BodsNameI,
  BodsPublicationDetailsI, BodsSourceI
} from '~/interfaces/btr-bods/components-i'
import { ExternalInfluenceE } from '~/enums/external-influence-e'

export interface BtrBodsPersonI {
  statementID: string
  statementType: BodsStatementTypeE, // should always be BodsStatementTypeE.PERSON_STATEMENT => personStatement
  statementDate: string
  isComponent: boolean
  personType: BodsPersonTypeE
  unspecifiedPersonDetails?: {
    reason: BodsUnspecifiedPersonDetailsTypeE
    description?: string
  }
  names: BodsNameI[]
  identifiers: BodsIdentifierI[]
  nationalities: BodsCountryI[]
  isPermanentResidentCa: boolean
  birthDate?: string
  deathDate?: string
  placeOfResidence: BodsBtrAddressI
  taxResidencies: BodsCountryI[]
  addresses: BodsBtrAddressI[]
  publicationDetails: BodsPublicationDetailsI
  source: BodsSourceI

  hasTaxNumber: boolean
  email: string

  externalInfluence: ExternalInfluenceE
  missingInfoReason: string
}
