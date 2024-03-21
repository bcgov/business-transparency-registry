import { storeToRefs } from 'pinia'
import { reviewConfirm, siChangeSubmit } from './button-actions'

// FUTURE: fill out all functions
export function getSIChangeBack (): ButtonControlI {
  const t = useNuxtApp().$i18n.t
  const params = { identifier: useBcrosBusiness().currentBusinessIdentifier }
  return {
    action: () => useRouter().push({ name: RouteNameE.BEN_OWNR_CHNG, params }),
    icon: 'i-mdi-chevron-left',
    label: t('labels.buttons.back'),
    trailing: false,
    variant: 'outline'
  }
}

export function getSIChangeCancel (): ButtonControlI {
  const t = useNuxtApp().$i18n.t
  return {
    action: () => {},
    label: t('labels.buttons.cancel'),
    variant: 'outline'
  }
}

export function getSIChangeConfirm (): ButtonControlI {
  const t = useNuxtApp().$i18n.t
  return {
    action: reviewConfirm,
    class: 'font-bold',
    icon: 'i-mdi-chevron-right',
    label: t('labels.buttons.reviewConfirm'),
    trailing: true
  }
}

export function getSIChangeSave (): ButtonControlI {
  const t = useNuxtApp().$i18n.t
  return {
    action: () => {},
    label: t('labels.buttons.save'),
    variant: 'outline'
  }
}

export function getSIChangeSaveExit (): ButtonControlI {
  const t = useNuxtApp().$i18n.t
  return {
    action: () => {},
    label: t('labels.buttons.saveExit'),
    variant: 'outline'
  }
}

export function getSIChangeSubmit (): ButtonControlI {
  const t = useNuxtApp().$i18n.t
  const { submitting } = storeToRefs(useSignificantIndividuals())
  return {
    action: siChangeSubmit,
    class: 'font-bold',
    icon: 'i-mdi-chevron-right',
    label: t('labels.buttons.fileNowNoFee'),
    loading: submitting.value,
    trailing: true
  }
}
