import { BtrCountryI } from '../../../btr-common-components/interfaces/btr-address-i'
import { BodsPersonTypeE, BodsStatementTypeE, BodsUnspecifiedPersonDetailsTypeE } from '~/enums/btr-bods-e'
import {
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
  taxResidencies: BtrCountryI[]
  addresses: BodsBtrAddressI[]
  publicationDetails: BodsPublicationDetailsI
  source: BodsSourceI

  hasTaxNumber: boolean
  email: string
  isTaxResident: boolean
}
