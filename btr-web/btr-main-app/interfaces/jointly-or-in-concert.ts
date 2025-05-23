import { type ConnectedInvidualSchemaType } from '~/utils/si-schema/definitions'

export interface JointlyOrInConcertConnectionsI {
  votesInConcert: Array<ConnectedInvidualSchemaType>
  votesJointly: Array<ConnectedInvidualSchemaType>

  sharesInConcert: Array<ConnectedInvidualSchemaType>
  sharesJointly: Array<ConnectedInvidualSchemaType>

  directorsInConcert: Array<ConnectedInvidualSchemaType>
  directorsJointly: Array<ConnectedInvidualSchemaType>
}
