import { z } from 'zod'
import { PhoneSchema } from '../../btr-common-components/interfaces/zod-schemas-t'

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

export function getPhoneNumberValidator () {
  return PhoneSchema.superRefine(
    validatePhoneNumberSuperRefine
  )
}
