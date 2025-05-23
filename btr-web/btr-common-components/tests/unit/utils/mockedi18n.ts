import { createI18n } from 'vue-i18n'
import en from '~/i18n/locales/en.json'

export const mockedI18n = createI18n({
  locale: 'en',
  messages: { en }
})
