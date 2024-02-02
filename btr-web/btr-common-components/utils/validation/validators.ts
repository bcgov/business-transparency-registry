import { z } from 'zod'

export function getAddressCountryValidator () {
  const { t } = useI18n()
  return z.object({ name: z.string(), alpha_2: z.string() }).refine(
    (val: BtrCountryI) => { return val.name !== '' }, t('errors.validation.address.country')
  )
}

export function getAddressLine1Validator () {
  const { t } = useI18n()
  return z.string().min(1, t('errors.validation.address.line1'))
}

export function getAddressCityValidator () {
  const { t } = useI18n()
  return z.string().min(1, t('errors.validation.address.city'))
}

export function getAddressRegionValidator () {
  const { t } = useI18n()
  return z.string().min(1, t('errors.validation.address.region'))
}

export function getAddressPostalCodeValidator () {
  const { t } = useI18n()
  return z.string().min(1, t('errors.validation.address.postalCode'))
}
