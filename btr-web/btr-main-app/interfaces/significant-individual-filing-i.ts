import { SignificantIndividualI } from './significant-individual-i'

export interface SignificantIndividualFilingI {
  businessIdentifier: string
  effectiveDate: string // YYYY-MM-DDT:HH:mm:ss+-HH:mm
  significantIndividuals: SignificantIndividualI[]
}
