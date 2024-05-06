import { z } from 'zod'

export function getEmailValidator () {
  const t = useNuxtApp().$i18n.t
  return z.string()
    .min(1, t('errors.validation.email.empty'))
    .max(254, 'errors.validation.email.maxLengthExceeded')
    .refine(validateEmailRfc6532Regex, t('errors.validation.email.invalid'))
}

export function getFolioValidator () {
  const { $i18n } = useNuxtApp()
  const maxFolioNumberLength = 30
  return z.union([
    z.string()
      .min(1)
      .max(maxFolioNumberLength, $i18n.t('errors.validation.folioNumber.maxLengthExceeded'))
      .refine(validateFolioNumberCharacters, $i18n.t('errors.validation.folioNumber.specialCharacter')),
    z.string().length(0)
  ]).optional()
}

export function getFullNameValidator () {
  const t = useNuxtApp().$i18n.t
  return z.preprocess(normalizeName as (arg: unknown) => unknown, z.string()
    .min(1, t('errors.validation.fullName.empty'))
    .max(150, t('errors.validation.fullName.maxLengthExceeded'))
    .refine(validateNameCharacters, t('errors.validation.fullName.specialCharacter')))
}

export function getPreferredNameValidator () {
  const t = useNuxtApp().$i18n.t
  return z.preprocess(normalizeName as (arg: unknown) => unknown, z.string()
    .max(150, t('errors.validation.preferredName.maxLengthExceeded'))
    .refine(validatePreferredName, t('errors.validation.preferredName.specialCharacter')))
}

export function validateCitizenshipValidator () {
  return z.array(z.object({ name: z.string(), alpha_2: z.string() })).superRefine(
    validateCitizenshipSuperRefine
  )
}
