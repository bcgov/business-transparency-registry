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

export function getTaxNumberValidator () {
  const t = useNuxtApp().$i18n.t
  return z.union([
    z.undefined(),
    z.string()
      .refine(checkSpecialCharacters, t('errors.validation.taxNumber.specialCharacter'))
      .refine(checkTaxNumberLength, t('errors.validation.taxNumber.invalidLength'))
      .refine(validateTaxNumber, t('errors.validation.taxNumber.invalidNumber'))
  ])
}

export function getAddressCountryValidator () {
  const t = useNuxtApp().$i18n.t
  return z.object({ name: z.string(), alpha_2: z.string() }).refine(
    (val: BtrCountryI) => { return val.name !== '' }, t('errors.validation.address.country')
  )
}

export function getAddressLine1Validator () {
  const t = useNuxtApp().$i18n.t
  return z.string().min(1, t('errors.validation.address.line1'))
}

export function getAddressCityValidator () {
  const t = useNuxtApp().$i18n.t
  return z.string().min(1, t('errors.validation.address.city'))
}

export function getAddressRegionValidator () {
  const t = useNuxtApp().$i18n.t
  return z.string().min(1, t('errors.validation.address.region'))
}

export function getAddressPostalCodeValidator () {
  const t = useNuxtApp().$i18n.t
  return z.string().min(1, t('errors.validation.address.postalCode'))
}
