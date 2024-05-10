export interface ControlSchemaI {
  controlName: ControlE
  registeredOwner: boolean
  beneficialOwner: boolean
  indirectControl: boolean
  inConcertControl: boolean
  actingJointly: boolean
  percentage: PercentageRangeE
}
