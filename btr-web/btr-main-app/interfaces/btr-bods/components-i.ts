import {
  BodsInterestDirectOrIndirectE,
  BodsInterestTypeE,
  BodsNameTypeE,
  BodsSourceTypeE
} from '~/enums/btr-bods-e'

export interface BodsAgentI {
  name?: string
  uri?: string
}

export interface BodsConnectedIndividualI {
  uuid: string
  legalName: string
  preferredName?: string
}

export interface BodsSourceI {
  type?: BodsSourceTypeE[]
  description?: string
  url?: string
  retrievedAt?: string // iso date time
  assertedBy?: BodsAgentI[]
}

export interface BodsIdentifierI {
  // https://standard.openownership.org/en/0.3.0/schema/reference.html#schema-identifier
  // required are either, scheme, or schemeName or both together
  id?: string
  scheme?: string
  schemeName?: string
  uri?: string
}

export enum BodsBtrAddressTypeE {
  /** residence address */
  RESIDENCE = 'residence',

  /** mailing address */
  REGISTERED = 'registered'
}

export interface BodsBtrAddressI {
  type: BodsBtrAddressTypeE
  street: string
  streetAdditional?: string
  city: string
  region: string
  postalCode: string
  locationDescription: string
  country: string
  countryName: string
}

export interface BodsNameI {
  fullName: string
  type?: BodsNameTypeE
  familyName?: string
  givenName?: string
  patronymicName?: string
}

export interface BodsInterestI {
  type?: BodsInterestTypeE
  directOrIndirect?: BodsInterestDirectOrIndirectE
  beneficialOwnershipOrControl?: boolean
  details?: string
  share?: {
    exact?: number
    maximum?: number
    minimum?: number
    exclusiveMinimum?: boolean // default value true
    exclusiveMaximum?: boolean // default value true
  }
  startDate?: string
  endDate?: string
  connectedIndividuals?: BodsConnectedIndividualI[]
}

export interface BodsCountryI {
  name: string
  code: string // 2-letter iso code, e.g. for Canada -> CA
}

export interface BodsPublisherI {
  // one of the two is required
  name?: string
  url?: string
}

export interface BodsPublicationDetailsI {
  publicationDate: string
  bodsVersion: string // format "^(\\d+\\.)(\\d+)$"
  publisher: BodsPublisherI
  license?: string // uri
}
