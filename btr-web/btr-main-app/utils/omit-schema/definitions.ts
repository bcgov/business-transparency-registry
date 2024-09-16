import { z, RefinementCtx } from 'zod'
import { CompletingIndividualTypeE } from '~/enums/omit/completing-individual-type-e'
import { validateNameSuperRefine } from '~/utils/validation'

// I'm using translate instead of message as it doesn't work with message
const emailSchema = z.string().superRefine((email: string, ctx: RefinementCtx): never => {
  // email
  if (!email || email.trim() === '') {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      translate: 'errors.validation.email.empty'
    })
    return z.NEVER
  }
  if (!validateEmailRfc6532Regex(email)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      translate: 'errors.validation.email.invalid'
    })
  }
  return z.NEVER
})

const nameSchema = z.string().superRefine(validateNameSuperRefine)

const certifySchema = z.boolean().superRefine((certify: boolean, ctx: RefinementCtx): never => {
  if (!certify) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      translate: 'errors.validation.certify'
    })
  }
  return z.NEVER
})

export const CompletingPartySchema = z.object({
  email: emailSchema,
  name: nameSchema,
  certify: certifySchema,
  invididualType: z.nativeEnum(CompletingIndividualTypeE)
})

export const OmitSchema = z.object({
  uuid: z.string().min(1),
  completingParty: CompletingPartySchema
})

export type OmitSchemaType = z.infer<typeof OmitSchema>
export type CompletingPartySchemaType = z.infer<typeof CompletingPartySchema>

export const CompletingPartyErrorMap: z.ZodErrorMap = (issue: z.ZodIssueOptionalMessage, ctx: z.ErrorMapCtx) => {
  const t = useNuxtApp().$i18n.t
  if (issue.translate) {
    return { message: t(issue.translate) }
  }
  return { message: ctx.defaultError }
}
