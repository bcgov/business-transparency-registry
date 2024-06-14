export interface NameAndUuidI {
  name: string
  uuid: string
}

export interface JointlyOrInConcertConnectionsI {
  votesInConcert: Array<NameAndUuidI>
  votesJointly: Array<NameAndUuidI>

  sharesInConcert: Array<NameAndUuidI>
  sharesJointly: Array<JointlyOrInConcertConnectionsI>

  directorsInConcert: Array<JointlyOrInConcertConnectionsI>
  directorsJointly: Array<JointlyOrInConcertConnectionsI>
}
