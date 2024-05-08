import { z } from 'zod'

export const CustomSiSchemaErrorMap: z.ZodErrorMap = (issue: z.ZodIssueOptionalMessage, ctx: z.ErrorMapCtx) => {
  const t = useNuxtApp().$i18n.t
  const errPath = issue.path.join('.')

  // address custom msg errors
  if (issue.code === z.ZodIssueCode.too_small && errPath === 'address.line1') {
    return { message: t('errors.validation.address.line1') }
  }
  if (issue.code === z.ZodIssueCode.too_small && errPath === 'address.city') {
    return { message: t('errors.validation.address.city') }
  }
  if (issue.code === z.ZodIssueCode.too_small && errPath === 'address.region') {
    return { message: t('errors.validation.address.region') }
  }
  if (issue.code === z.ZodIssueCode.too_small && errPath === 'address.postalCode') {
    return { message: t('errors.validation.address.postalCode') }
  }

  // isTaxResident custom errors
  if (issue.code === z.ZodIssueCode.invalid_type &&
    errPath === 'isTaxResident' &&
    issue.received === 'undefined'
  ) {
    return { message: t('errors.validation.taxResidency.required') }
  }

  // missing info reason
  if (issue.code === z.ZodIssueCode.too_small && errPath === 'missingInfoReason') {
    return { message: t('errors.validation.missingInfoReason.required') }
  }

  // birthdate errors
  if (issue.code === z.ZodIssueCode.too_small && errPath === 'birthDate') {
    return { message: t('errors.validation.birthDate.required') }
  }
  return { message: ctx.defaultError }
}

//
