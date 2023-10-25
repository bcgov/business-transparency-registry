export type BtrCountry = {
  name: string
  alpha_2: string // The 2-letter country code (ISO 3166-1)
}

export type BtrAddress = {
  country: BtrCountry
  line1: string
  line2?: string
  city: string
  region: string
  postalCode: string
  locationDescription?: string
}

export type BtrCountrySubdivision = {
  name: string
  code: string
  type: string
}
