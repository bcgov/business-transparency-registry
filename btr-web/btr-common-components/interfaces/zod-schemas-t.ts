import { z } from 'zod'

export const PhoneSchema = z.object({
  countryCode: z.string().min(1).max(3),
  number: z.string().min(1).max(14),
  extension: z.string().optional()
})
export type PhoneSchemaType = z.infer<typeof PhoneSchema>
