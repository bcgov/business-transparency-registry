export interface BtrCountryI {
  name: string
  alpha_2: string // The 2-letter country code (ISO 3166-1)
}

export interface BtrAddressI {
  country: BtrCountryI
  line1: string
  line2?: string
  city: string
  region: string
  postalCode: string
  locationDescription?: string
}

export interface BtrCountrySubdivisionI {
  name: string
  code: string
  type: string
}
