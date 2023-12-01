import { ProfileI } from './profile-i'
import { FilingActionE } from '~/enums/filing-action-e'

export interface SignificantIndividualI {
  controlType: {
    sharesVotes: ControlOfSharesI
    directors: ControlOfDirectorsI
    other: string // other ways this person has SI control
  }
  missingInfoReason: string
  percentOfShares: string
  percentOfVotes: string
  profile: ProfileI
  startDate: string // YYYY-MM-DDT:HH:mm:ss+-HH:mm
  endDate?: string // YYYY-MM-DDT:HH:mm:ss+-HH:mm
  action?: FilingActionE // FUTURE: enum for removed/changed/added
}
