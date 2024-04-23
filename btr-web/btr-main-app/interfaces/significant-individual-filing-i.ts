import { SignificantIndividualI } from './significant-individual-i'

export interface SignificantIndividualFilingI {
  noSignificantIndividualsExist: boolean
  businessIdentifier: string
  folioNumber: string
  effectiveDate: string // YYYY-MM-DD
  significantIndividuals: SignificantIndividualI[]
  certified: boolean
}
