import { ProfileI } from './profile-i'
import { FilingActionE } from '~/enums/filing-action-e'
import { ExternalInfluenceE } from '~/enums/external-influence-e'
import { PercentageRangeE } from '#ui-colors/imports'

export interface SignificantIndividualI {
  controlType: {
    sharesVotes: ControlOfSharesI
    directors: ControlOfDirectorsI
    other: string // other ways this person has SI control
  }
  externalInfluence: ExternalInfluenceE
  missingInfoReason: string
  percentOfShares: PercentageRangeE
  percentOfVotes: PercentageRangeE
  profile: ProfileI
  startDate: string // YYYY-MM-DDT
  endDate?: string // YYYY-MM-DDT
  action?: FilingActionE
  uuid?: string
}
