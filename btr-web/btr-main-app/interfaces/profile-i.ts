export interface ProfileI {
  address: BtrAddressI
  competency: {
    decisionMaking: boolean // no one else can influence decision making
    financialAffairs: boolean // is able to manage own financial affairs
  }
  birthDate: string // YYYY-MM-DD
  citizenshipCA: string // FUTURE: enum
  citizenshipsExCA: BtrCountryI[]
  email: string
  hasTaxNumber: boolean
  isTaxResident: boolean
  fullName: string
  preferredName: string
  taxNumber?: string
  uuid?: string
}
