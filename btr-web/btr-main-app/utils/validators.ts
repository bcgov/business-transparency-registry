import { z } from 'zod'

export function getEmailValidator () {
  const { t } = useI18n()
  return z.string()
    .min(1, t('errors.validation.email.empty'))
    .max(254, 'errors.validation.email.maxLengthExceeded')
    .refine(validateEmailRfc6532Regex, t('errors.validation.email.invalid'))
}

export function getFullNameValidator () {
  const { t } = useI18n()
  return z.preprocess(normalizeName as (arg: unknown) => unknown, z.string()
    .min(1, t('errors.validation.fullName.empty'))
    .max(150, t('errors.validation.fullName.maxLengthExceeded'))
    .refine(validateNameCharacters, t('errors.validation.fullName.specialCharacter')))
}

export function getPreferredNameValidator () {
  const { t } = useI18n()
  return z.preprocess(normalizeName as (arg: unknown) => unknown, z.string()
    .max(150, t('errors.validation.preferredName.maxLengthExceeded'))
    .refine(validatePreferredName, t('errors.validation.preferredName.specialCharacter')))
}

export function getTaxNumberValidator () {
  const { t } = useI18n()
  return z.union([
    z.undefined(),
    z.string()
      .refine(checkSpecialCharacters, t('errors.validation.taxNumber.specialCharacter'))
      .refine(checkTaxNumberLength, t('errors.validation.taxNumber.invalidLength'))
      .refine(validateTaxNumber, t('errors.validation.taxNumber.invalidNumber'))
  ])
}

export function getPercentageValidator () {
  const { t } = useI18n()
  return z.string()
    .refine(validatePercentageWholeNumber, t('errors.validation.controlPercentage.specialCharacter'))
    .refine(validatePercentageFormat, t('errors.validation.controlPercentage.invalidFormat'))
    .refine(validatePercentageValue, t('errors.validation.controlPercentage.maxValueReached'))
}
