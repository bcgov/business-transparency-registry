import { SignificantIndividualI } from './significant-individual-i'

export interface SignificantIndividualFilingI {
  businessIdentifier: string
  folioNumber: string
  effectiveDate: string // YYYY-MM-DD
  significantIndividuals: SignificantIndividualI[]
  certified: boolean
}
