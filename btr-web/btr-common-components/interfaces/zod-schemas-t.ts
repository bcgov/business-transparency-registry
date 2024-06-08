import { z } from 'zod'

export const PhoneSchema = z.object({
  countryCallingCode: z.string().optional(), // .min(1).max(3),
  countryCode2letterIso: z.string().length(2).optional(),
  number: z.string().optional(), // .min(1).max(14),
  extension: z.string().optional()
})
export type PhoneSchemaType = z.infer<typeof PhoneSchema>
