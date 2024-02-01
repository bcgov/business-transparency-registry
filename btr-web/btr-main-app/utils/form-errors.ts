export function getMissingSharesAndVotesError () {
  const { t } = useI18n()
  return {
    message: t('errors.validation.controlPercentage.required'),
    path: ['percentOfShares', 'percentOfVotes']
  }
}

export function getMissingControlOfSharesError () {
  const { t } = useI18n()
  return {
    message: t('errors.validation.sharesAndVotes.required'),
    path: ['controlOfShares']
  }
}

export function getMissingControlOfDirectorsError () {
  const { t } = useI18n()
  return {
    message: t('errors.validation.controlOfDirectors.required'),
    path: ['controlOfDirectors']
  }
}

export function getMissingBirthDateError () {
  const { t } = useI18n()
  return {
    message: t('errors.validation.birthDate.required'),
    path: ['birthDate']
  }
}

export function getMissingCitizenshipError () {
  const { t } = useI18n()
  return {
    message: t('errors.validation.citizenship.required'),
    path: ['citizenshipCA']
  }
}

export function getMissingOtherCountryError () {
  const { t } = useI18n()
  return {
    message: t('errors.validation.citizenship.otherCountry'),
    path: ['citizenshipsExCA']
  }
}

export function getMissingTaxNumberInfoError () {
  const { t } = useI18n()
  return {
    message: t('errors.validation.taxNumber.required'),
    path: ['hasTaxNumber']
  }
}

export function getMissingTaxResidencyError () {
  const { t } = useI18n()
  return {
    message: t('errors.validation.taxResidency.required'),
    path: ['taxResidency']
  }
}

export function getNoMissingInfoReasonError () {
  const { t } = useI18n()
  return {
    message: t('errors.validation.missingInfoReason.required'),
    path: ['missingInfoReason']
  }
}
