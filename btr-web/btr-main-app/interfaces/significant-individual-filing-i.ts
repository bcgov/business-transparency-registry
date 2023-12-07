import { SignificantIndividualI } from './significant-individual-i'

export interface SignificantIndividualFilingI {
  businessIdentifier: string
  folioNumber: string
  effectiveDate: string // YYYY-MM-DDT:HH:mm:ss+-HH:mm
  significantIndividuals: SignificantIndividualI[]
  certified: boolean
}
