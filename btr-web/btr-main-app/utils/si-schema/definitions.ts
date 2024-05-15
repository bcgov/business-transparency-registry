import { z } from 'zod'
import { PercentageRangeE } from '~/enums/percentage-range-e'

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

export const ControlOfDirectorsSchema = z.object({
  directControl: z.boolean(),
  indirectControl: z.boolean(),
  significantInfluence: z.boolean(),
  inConcertControl: z.boolean().optional(),
  actingJointly: z.boolean().optional()
})

export const SiNameSchema = z.object({
  isYourOwnInformation: z.boolean(),
  isUsePreferredName: z.boolean(),
  fullName: z.string(),
  preferredName: z.string()
})

export const TaxSchema = z.object({
  hasTaxNumber: z.union([z.null(), z.boolean()]),
  taxNumber: z.union([z.null(), z.string()])
})

export const AddressSchema = z.object({
  country: z.union([z.null(), z.object({ name: z.string(), alpha_2: z.string() })]),
  line1: z.string().min(1),
  line2: z.string().optional(),
  city: z.string().min(1),
  region: z.string().min(1),
  postalCode: z.string().min(1),
  locationDescription: z.string().optional()
})

export const SiSchema = z.object({
  couldNotProvideMissingInfo: z.boolean(),
  missingInfoReason: z.string().optional(),
  name: SiNameSchema,
  controlOfShares: SiControlOfSchema,
  controlOfVotes: SiControlOfSchema,
  controlOfDirectors: z.object({
    directControl: z.boolean(),
    indirectControl: z.boolean(),
    significantInfluence: z.boolean(),
    inConcertControl: z.boolean(),
    actingJointly: z.boolean()
  }),
  controlOther: z.string().optional(),
  email: z.string(),
  address: AddressSchema,
  birthDate: z.string().min(1),
  citizenships: validateCitizenshipValidator(),
  tax: TaxSchema,
  isTaxResident: z.boolean().optional()
})

export type SiSchemaType = z.infer<typeof SiSchema>
