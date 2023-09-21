export interface IndividualPersonInterface {
  uuid: string
  fullName: string
  address: string
  details?: {
    dateOfBirth?: string
    taxResidency?: Array<string>
  }
  significanceDates: Array<string>
  controlsText: string
}

export interface Vaboo {
  uuid: string
}
