import { type BtrBodsEntityI } from '~/interfaces/btr-bods/btr-bods-entity-i'
import { type BtrBodsPersonI } from '~/interfaces/btr-bods/btr-bods-person-i'
import {type  BtrBodsOwnershipOrControlI } from '~/interfaces/btr-bods/btr-bods-ownership-or-control-i'
import { SubmissionTypeE } from '~/enums/submission-type-e'

export interface BtrFilingI {
  id: number
  noSignificantIndividualsExist: boolean
  businessIdentifier: string
  effectiveDate: string
  entityStatement: BtrBodsEntityI
  personStatements: BtrBodsPersonI[]
  ownershipOrControlStatements: BtrBodsOwnershipOrControlI[],
  arFilingForYear?: number
  filingType?: SubmissionTypeE
}
