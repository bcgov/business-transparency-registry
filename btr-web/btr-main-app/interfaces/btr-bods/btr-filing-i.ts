import { BtrBodsEntityI } from '~/interfaces/btr-bods/btr-bods-entity-i'
import { BtrBodsPersonI } from '~/interfaces/btr-bods/btr-bods-person-i'
import { BtrBodsOwnershipOrControlI } from '~/interfaces/btr-bods/btr-bods-ownership-or-control-i'

export interface BtrFilingI {
  noSignificantIndividualsExist: boolean
  businessIdentifier: string
  effectiveDate: string
  entityStatement: BtrBodsEntityI
  personStatements: BtrBodsPersonI[]
  ownershipOrControlStatements: BtrBodsOwnershipOrControlI[]
}
