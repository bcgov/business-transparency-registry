export function getBcrosHomeDashboardCrumb (): BreadcrumbI {
  const { $i18n } = useNuxtApp()
  const t = $i18n.t
  return {
    text: t('breadcrumbs.registryDashboard'),
    href: useRuntimeConfig().public.registryDashboardURL
  }
}

export function getBeneficialOwnerChangeCrumb (): BreadcrumbI {
  const { $i18n } = useNuxtApp()
  const t = $i18n.t
  return { text: t('breadcrumbs.beneficialOwnerChange') }
}

export function getBusinessDashboardCrumb (): BreadcrumbI {
  const { $i18n } = useNuxtApp()
  const t = $i18n.t
  const account = useBcrosAccount()
  return {
    text: t('breadcrumbs.businessDashboard'),
    href: `${useRuntimeConfig().public.authWebURL}account/${account.currentAccount.id}/business`
  }
}

export function getBusinessNameCrumb (): BreadcrumbI {
  const business = useBcrosBusiness()
  const route = useRoute()
  return {
    text: business.currentBusinessName || route?.params?.identifier || 'Unknown',
    href: `${useRuntimeConfig().public.businessWebURL}${route?.params?.identifier || ''}`
  }
}

export function getMyRegDetailsCrumb (): BreadcrumbI {
  const { $i18n } = useNuxtApp()
  const t = $i18n.t
  return { text: t('breadcrumbs.myRegDetails') }
}
