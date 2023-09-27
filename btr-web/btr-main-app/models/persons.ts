export interface IndividualPersonInterface {
  uuid: string
  fullName: string
  address: string
  details?: {
    dateOfBirth?: string
    residency?: Array<string>
    isTaxResident?: boolean
  }
  significanceDates: Array<string>
  controlsText: string
}
