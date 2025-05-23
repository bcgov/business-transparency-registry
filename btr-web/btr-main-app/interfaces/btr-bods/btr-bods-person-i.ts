import { type PhoneSchemaType } from '../../../btr-common-components/interfaces/zod-schemas-t'
import { BodsPersonTypeE, BodsStatementTypeE, BodsUnspecifiedPersonDetailsTypeE } from '~/enums/btr-bods-e'
import type {
  BodsBtrAddressI,
  BodsCountryI,
  BodsIdentifierI,
  BodsNameI,
  BodsPublicationDetailsI, BodsSourceI
} from '~/interfaces/btr-bods/components-i'

export interface BtrBodsPersonI {
  statementID: string
  statementType: BodsStatementTypeE, // should always be BodsStatementTypeE.PERSON_STATEMENT => personStatement
  statementDate: string
  isComponent: boolean
  personType: BodsPersonTypeE
  publicationDetails: BodsPublicationDetailsI
  source: BodsSourceI

  unspecifiedPersonDetails?: {
    reason: BodsUnspecifiedPersonDetailsTypeE
    description?: string
  }
  names?: BodsNameI[]
  identifiers?: BodsIdentifierI[]
  nationalities?: BodsCountryI[]
  isPermanentResidentCa?: boolean
  birthDate?: string
  deathDate?: string
  placeOfResidence?: BodsBtrAddressI
  taxResidencies?: BodsCountryI[]
  addresses?: BodsBtrAddressI[]
  hasMailingAddress?: boolean
  phoneNumber?: PhoneSchemaType

  determinationOfIncapacity?: boolean

  hasTaxNumber?: boolean
  email?: string

  missingInfoReason?: string

  // this is user uuid from our API, not the statementID. Statement ID needs to change when there is new data
  uuid?: string
}
