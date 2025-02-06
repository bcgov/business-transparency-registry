import { ContactInfoI } from '~/interfaces/contact-info-i'

export interface GlobalErrorI {
  code?: number
  error: string
  title?: string
  message?: string
  contactsInfo: ContactInfoI[]
  isCritical: boolean
}

export const SomethingWentWrongError =
  (isCritical: boolean = false): GlobalErrorI => {
    const t = useNuxtApp().$i18n.t

    return {
      code: 500,
      error: t('errors.somethingWentWrong'),
      title: t('errors.somethingWentWrong'),
      message: t('errors.anErrorHasOccurred'),
      contactsInfo: getContactInfo('registries'),
      isCritical: isCritical || false
    }
  }
