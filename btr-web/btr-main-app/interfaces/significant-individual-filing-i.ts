import { z } from 'zod'

export const FilingSchemaBase = z.object({
  noSignificantIndividualsExist: z.boolean().default(false),
  businessIdentifier: z.string(),
  folioNumber: z.string().optional(),
  effectiveDate: z.string(),
  significantIndividuals: z.object({}).array(), // SignificantIndividualI[]
  certified: z.literal<boolean>(true)
})

export type FilingSchemaType = z.infer<typeof FilingSchemaBase>

export interface SignificantIndividualFilingI extends FilingSchemaType {
  significantIndividuals: SignificantIndividualI[]
}
