export interface FormInputI {
  fullName: string
  preferredName: string
  email: string
  percentOfShares: string
  percentOfVotes: string
  controlOfShares: ControlOfSharesI
  otherReason: string
  controlOfDirectors: ControlOfDirectorsI
  birthDate: string
  citizenshipCA: CitizenshipTypeE
  citizenshipsExCA: BtrCountryI[]
  hasTaxNumber: boolean
  taxNumber: string
  taxResidency: boolean
  missingInfo: boolean
  missingInfoReason: string
}
