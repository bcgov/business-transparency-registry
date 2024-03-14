export function getBcrosHomeDashboardCrumb (): BreadcrumbI {
  const t = useNuxtApp().$i18n.t
  return {
    text: t('breadcrumbs.registryDashboard'),
    href: useRuntimeConfig().public.registryDashboardURL
  }
}

export function getBeneficialOwnerChangeCrumb (): BreadcrumbI {
  const t = useNuxtApp().$i18n.t
  return { text: t('breadcrumbs.beneficialOwnerChange') }
}

export function getBusinessDashboardCrumb (): BreadcrumbI {
  const t = useNuxtApp().$i18n.t
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
  const t = useNuxtApp().$i18n.t
  return { text: t('breadcrumbs.myRegDetails') }
}
