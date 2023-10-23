export type Country = {
  name: string
  alpha_2: string // The 2-letter country code (ISO 3166-1)
}


export type BtrAddress = {
  country: Country
  line1: string
  line2?: string
  city: string
  region: string
  postalCode: string
  locationDescription?: string
}
