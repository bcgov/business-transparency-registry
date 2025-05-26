import type { BodsInterestI, BodsPublicationDetailsI, BodsSourceI } from '~/interfaces/btr-bods/components-i'
import { BodsStatementTypeE, BodsInterestTypeE } from '~/enums/btr-bods-e'

export interface BodsInterestedPartyI {
  describedByEntityStatement?: string
  describedByPersonStatement?: string
  unspecified?: string
}

export interface BtrBodsOwnershipOrControlI {
  statementID: string
  statementType: BodsStatementTypeE, // For this object it is always BodsStatementTypeE.OWNERSHIP_OR_CONTROL_STATEMENT
  statementDate: string
  isComponent: boolean
  subject: {
    // original bods have other possibilities like describedByPersonStatement etc... but for our purposes
    // this will always be entity
    describedByEntityStatement: string
  },
  interestedParty: BodsInterestedPartyI // for now this is naturalized person for our purposes
  interests: BodsInterestI[],
  interestTypes?: BodsInterestTypeE[], // list of interest types included in 'interests'
  publicationDetails: BodsPublicationDetailsI
  source: BodsSourceI
}
