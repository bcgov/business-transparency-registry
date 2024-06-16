export interface NamesAndUuidI {
  uuid: string
  legalName: string
  preferredName?: string
}

export interface JointlyOrInConcertConnectionsI {
  votesInConcert: Array<NamesAndUuidI>
  votesJointly: Array<NamesAndUuidI>

  sharesInConcert: Array<NamesAndUuidI>
  sharesJointly: Array<JointlyOrInConcertConnectionsI>

  directorsInConcert: Array<JointlyOrInConcertConnectionsI>
  directorsJointly: Array<JointlyOrInConcertConnectionsI>
}
