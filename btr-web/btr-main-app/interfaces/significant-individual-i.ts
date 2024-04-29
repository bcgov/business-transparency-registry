import { ProfileI } from './profile-i'
import { FilingActionE } from '~/enums/filing-action-e'

export interface SignificantIndividualI {
  isYourOwnInformation: boolean,
  controlType: {
    sharesVotes: ControlOfSharesI
    directors: ControlOfDirectorsI
    other: string // other ways this person has SI control
  }
  missingInfoReason: string
  percentOfShares: PercentageRangeE
  percentOfVotes: PercentageRangeE
  profile: ProfileI
  startDate: string // YYYY-MM-DDT
  endDate?: string // YYYY-MM-DDT
  action?: FilingActionE
  uuid?: string
}

export interface SignificantIndividualV2I {

}
