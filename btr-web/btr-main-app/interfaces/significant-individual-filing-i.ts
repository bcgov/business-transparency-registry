import { SignificantIndividualI } from './significant-individual-i'

export interface SignificantIndividualFilingI {
  businessIdentifier: string
  effectiveDate: string
  significantIndividuals: SignificantIndividualI[]
}
