import { createI18n } from 'vue-i18n'
import enCommon from '../../../btr-common-components/i18n/locales/en.json'
import en from '~/i18n/locales/en.json'

export const mockedI18n = createI18n({
  locale: 'en',
  messages: {
    en: {
      ...enCommon,
      buttons: { ...en.buttons },
      errors: { ...enCommon.errors, ...en.errors },
      labels: { ...enCommon.labels, ...en.labels },
      placeholders: { ...enCommon.placeholders, ...en.placeholders },
      pageHeadings: { ...en.pageHeadings },
      sectionTitles: { ...en.sectionTitles },
      texts: { ...en.texts },
      summaryTable: { ...en.summaryTable }
    }
  }
})
