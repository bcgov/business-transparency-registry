import { ProfileI } from './profile-i'

export interface SignificantIndividualI {
  controlType: {
    sharesVotes: { // (types of control over votes/shares)
      registeredOwner: boolean,
      beneficialOwner: boolean,
      indirectControl: boolean
    }
    directors: ControlOfDirectorsI
    other: string // other ways this person has SI control
  }
  missingInfoReason: string
  percentOfShares: string
  percentOfVotes: string
  profile: ProfileI
  startDate: string
  endDate?: string
  action?: string // FUTURE: enum for removed/changed/added
}
