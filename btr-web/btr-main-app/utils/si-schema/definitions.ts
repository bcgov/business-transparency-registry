import { z } from 'zod'
import { PercentageRangeE } from '~/enums/percentage-range-e'
import { PhoneSchema } from '../../../btr-common-components/interfaces/zod-schemas-t'

const StartEndDateGroup = z.object({
  startDate: z.string().min(1),
  endDate: z.string().optional()
})

export type StartEndDateGroupSchemaType = z.infer<typeof StartEndDateGroup>

const ConnectedIndividual = z.object({
  uuid: z.string(),
  legalName: z.string(),
  preferredName: z.string().optional()
})

export type ConnectedInvidualSchemaType = z.infer<typeof ConnectedIndividual>

export const SiControlOfSchema = z.object({
  controlName: z.enum(['controlOfShares', 'controlOfVotes']),
  registeredOwner: z.boolean(),
  beneficialOwner: z.boolean(),
  indirectControl: z.boolean(),
  inConcertControl: z.boolean().optional(),
  actingJointly: z.boolean().optional(),
  percentage: z.nativeEnum(PercentageRangeE).optional()
})

export type SiControlOfSchemaType = z.infer<typeof SiControlOfSchema>

export const SiControlOfDirectorsSchema = z.object({
  directControl: z.boolean(),
  indirectControl: z.boolean(),
  significantInfluence: z.boolean(),
  inConcertControl: z.boolean().optional(),
  actingJointly: z.boolean().optional()
})

export type SiControlOfDirectorsSchemaType = z.infer<typeof SiControlOfDirectorsSchema>

export const SiNameSchema = z.object({
  isYourOwnInformation: z.boolean(),
  isUsePreferredName: z.boolean(),
  fullName: z.string(),
  preferredName: z.string()
})

export const TaxSchema = z.object({
  hasTaxNumber: z.boolean().optional(),
  taxNumber: z.string().optional()
})

export const CountrySchema = z.object({ name: z.string(), alpha_2: z.string() })
export type CountrySchemaType = z.infer<typeof CountrySchema>

export const AddressSchema = z.object({
  country: CountrySchema.optional(),
  line1: z.string().min(1),
  line2: z.string().optional(),
  city: z.string().min(1),
  region: z.string().min(1),
  postalCode: z.string().min(1),
  locationDescription: z.string().optional()
})
export type AddressSchemaType = z.infer<typeof AddressSchema>

export const SiSchema = z.object({
  couldNotProvideMissingInfo: z.boolean(),
  missingInfoReason: z.string().optional(),
  name: SiNameSchema,
  controlOfShares: SiControlOfSchema,
  controlOfVotes: SiControlOfSchema,
  controlOfDirectors: SiControlOfDirectorsSchema,
  controlOther: z.string().optional(),
  email: z.string(),
  address: AddressSchema,
  birthDate: z.string().min(1),
  citizenships: validateCitizenshipValidator(),
  tax: TaxSchema,
  isTaxResident: z.boolean().optional(),
  determinationOfIncapacity: z.boolean(),
  phoneNumber: PhoneSchema,

  effectiveDates: z.array(StartEndDateGroup).min(1),

  uuid: z.string().min(1),

  // UI helper values
  ui: z.object({
    action: z.nativeEnum(FilingActionE).optional()
  }),

  sharesInConcert: z.array(ConnectedIndividual),
  sharesActingJointly: z.array(ConnectedIndividual),
  votesInConcert: z.array(ConnectedIndividual),
  votesActingJointly: z.array(ConnectedIndividual),
  directorsInConcert: z.array(ConnectedIndividual),
  directorsActingJointly: z.array(ConnectedIndividual)
})

export type SiSchemaType = z.infer<typeof SiSchema>
