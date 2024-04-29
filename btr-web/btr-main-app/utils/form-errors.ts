export function getMissingSharesAndVotesError () {
  const { $i18n } = useNuxtApp()
  return {
    message: $i18n.t('errors.validation.controlPercentage.empty'),
    path: ['percentOfShares', 'percentOfVotes']
  }
}

export function getMissingControlOfSharesError () {
  const t = useNuxtApp().$i18n.t
  return {
    message: t('errors.validation.sharesAndVotes.required'),
    path: ['controlOfShares']
  }
}

export function getMissingControlOfDirectorsError () {
  const t = useNuxtApp().$i18n.t
  return {
    message: t('errors.validation.controlOfDirectors.required')
    // path: ['controlOfDirectors']
  }
}

export function getMissingBirthDateError () {
  const t = useNuxtApp().$i18n.t
  return {
    message: t('errors.validation.birthDate.required'),
    path: ['birthDate']
  }
}

export function getMissingCitizenshipError () {
  const t = useNuxtApp().$i18n.t
  return {
    message: t('errors.validation.citizenship.required'),
    path: ['citizenshipCA']
  }
}

export function getMissingOtherCountryError () {
  const t = useNuxtApp().$i18n.t
  return {
    message: t('errors.validation.citizenship.required'),
    path: ['citizenshipsExCA']
  }
}

export function getMissingTaxNumberInfoError () {
  const t = useNuxtApp().$i18n.t
  return {
    message: t('errors.validation.taxNumber.required'),
    path: ['hasTaxNumber']
  }
}

export function getMissingTaxResidencyError () {
  const t = useNuxtApp().$i18n.t
  return {
    message: t('errors.validation.taxResidency.required'),
    path: ['taxResidency']
  }
}

export function getNoMissingInfoReasonError () {
  const t = useNuxtApp().$i18n.t
  return {
    message: t('errors.validation.missingInfoReason.required'),
    path: ['missingInfoReason']
  }
}
