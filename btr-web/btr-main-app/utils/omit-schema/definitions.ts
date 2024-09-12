import { z, RefinementCtx } from 'zod'
import { CompletingIndividualTypeE } from '~/enums/omit/completing-individual-type-e'
import { validateNameSuperRefine } from '~/utils/validation'

const emailSchema = z.string().superRefine((email: string, ctx: RefinementCtx): never => {
  // email
  if (!email || email.trim() === '') {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'errors.validation.email.empty'
    })
  }
  if (!validateEmailRfc6532Regex(email)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'errors.validation.email.invalid'
    })
  }
  return z.NEVER
})

const nameSchema = z.string().superRefine(validateNameSuperRefine)

export const CompletingPartySchema = z.object({
  email: emailSchema,
  name: nameSchema,
  certify: z.literal<boolean>(true, { errorMap: () => ({ message: 'errors.validation.certify' }) }),
  invididualType: z.nativeEnum(CompletingIndividualTypeE)
})

export const OmitSchema = z.object({
  uuid: z.string().min(1),
  completingParty: CompletingPartySchema
})

export type OmitSchemaType = z.infer<typeof OmitSchema>
export type CompletingPartySchemaType = z.infer<typeof CompletingPartySchema>
