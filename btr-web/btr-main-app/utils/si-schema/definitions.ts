import { z } from 'zod'
import { PercentageRangeE } from '~/enums/percentage-range-e'

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
  isNameChanged: z.boolean().optional(),
  nameChangeReason: z.string().optional(),
  preferredName: z.string()
})

export type SiNameSchemaType = z.infer<typeof SiNameSchema>

export const TaxSchema = z.object({
  hasTaxNumber: z.boolean().optional(),
  taxNumber: z.string().optional()
})

export const CountrySchema = z.object({ name: z.string(), alpha_2: z.string() })
export type CountrySchemaType = z.infer<typeof CountrySchema>
export const CitizenshipSchema = z.object({
  nationalities: z.array(CountrySchema),
  citizenshipType: z.nativeEnum(CitizenshipTypeE).optional()
})
export type CitizenshipSchemaType = z.infer<typeof CitizenshipSchema>

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
  email: z.string(),
  address: AddressSchema,
  mailingAddress: z.object({
    isDifferent: z.boolean(),
    address: AddressSchema.optional()
  }),
  birthDate: z.string().min(1),
  citizenships: CitizenshipSchema,
  tax: TaxSchema,
  isTaxResident: z.boolean().optional(),
  determinationOfIncapacity: z.boolean(),
  phoneNumber: getPhoneNumberValidator(),

  effectiveDates: z.array(StartEndDateGroup).min(1),

  uuid: z.string().min(1),
  ownershipStatementId: z.string().optional(),

  // UI helper values
  ui: z.object({
    newOrUpdatedFields: z.array(z.string()),
    actions: z.array(z.nativeEnum(FilingActionE)).optional(),
    origIndex: z.number().optional(),
    showCeaseDateInput: z.boolean().optional(),
    updating: z.boolean().optional()
  })
})

export type SiSchemaType = z.infer<typeof SiSchema>
