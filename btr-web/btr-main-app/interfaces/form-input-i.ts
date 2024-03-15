export interface FormInputI {
  fullName: string
  preferredName: string
  email: string
  percentOfShares: PercentageRangeE
  percentOfVotes: PercentageRangeE
  controlOfShares: ControlOfSharesI
  otherReasons: string
  controlOfDirectors: ControlOfDirectorsI
  birthDate: string

  country: BtrCountryI,
  line1: string
  line2: string
  city: string
  region: string
  postalCode: string
  locationDescription: string

  citizenshipCA: CitizenshipTypeE
  citizenshipsExCA: BtrCountryI[]
  hasTaxNumber: boolean
  taxNumber: string
  taxResidency: boolean
  missingInfo: boolean
  missingInfoReason: string
}
