import { reviewConfirm } from './button-actions'

// FUTURE: pass action functions from SI store
export function getSIChangeCancel (): ButtonControlI {
  return {
    action: () => {},
    label: useI18n().t('labels.buttons.cancel'),
    variant: 'outline'
  }
}

export function getSIChangeConfirm (): ButtonControlI {
  return {
    action: reviewConfirm,
    icon: 'i-mdi-chevron-right',
    label: useI18n().t('labels.buttons.reviewConfirm'),
    trailing: true
  }
}

export function getSIChangeSave (): ButtonControlI {
  return {
    action: () => {},
    label: useI18n().t('labels.buttons.save'),
    variant: 'outline'
  }
}

export function getSIChangeSaveExit (): ButtonControlI {
  return {
    action: () => {},
    label: useI18n().t('labels.buttons.saveExit'),
    variant: 'outline'
  }
}
