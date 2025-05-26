import { type SiSchemaType } from '~/utils/si-schema/definitions'

/** Check if a significant individual has control of shares, votes, or directors that are
 * held jointly and/or exercised in concert
 * @param si significant individual schema
 */
export const hasSharedControl = (si: SiSchemaType) => {
  return si.controlOfShares.actingJointly || si.controlOfShares.inConcertControl ||
    si.controlOfVotes.actingJointly || si.controlOfVotes.inConcertControl ||
    si.controlOfDirectors.actingJointly || si.controlOfDirectors.inConcertControl
}
