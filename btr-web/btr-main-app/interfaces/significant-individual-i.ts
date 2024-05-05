import { ProfileI } from './profile-i'
import { FilingActionE } from '~/enums/filing-action-e'
import { ControlOfSharesI } from '~/interfaces/control-of-shares-i'
import { ControlOfDirectorsI } from '~/interfaces/control-of-directors-i'

export interface SignificantIndividualI {
  isYourOwnInformation: boolean | undefined,
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
