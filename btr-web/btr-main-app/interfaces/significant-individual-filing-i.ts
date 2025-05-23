import { z } from 'zod'
import { type SiSchemaType } from '~/utils/si-schema/definitions'

export const FilingSchemaBase = z.object({
  submissionType: z.nativeEnum(SubmissionTypeE),
  submissionForYear: z.number().optional(),
  annualFilingNoChanges: z.boolean().optional(),
  noPreviousFiling: z.boolean().optional(),
  effectiveDate: z.string().min(1),
  noSignificantIndividualsExist: z.boolean().default(false),
  businessIdentifier: z.string(),
  folioNumber: z.string().optional(),
  significantIndividuals: z.object({
    ui: z.object({
      newOrUpdatedFields: z.array(z.string()),
      actions: z.array(z.nativeEnum(FilingActionE)).optional()
    })
  }).array(), // SignificantIndividualI[]
  certified: z.literal<boolean>(true)
})

export type FilingSchemaType = z.infer<typeof FilingSchemaBase>

export interface SignificantIndividualFilingI extends FilingSchemaType {
  significantIndividuals: SiSchemaType[]
}
