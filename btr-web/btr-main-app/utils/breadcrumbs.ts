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

export function getRequestOmitCrumb (): BreadcrumbI {
  const t = useNuxtApp().$i18n.t
  return { text: t('breadcrumbs.requestOmit') }
}

export function getBcrosStaffDashboardCrumb (): BreadcrumbI {
  const config = useRuntimeConfig()
  const t = useNuxtApp().$i18n.t
  return {
    text: t('pageHeadings.staffDash'),
    href: `${config.public.authWebURL}/staff/dashboard/active`
  }
}
export function getBcrosStaffSIDashCrumb (): BreadcrumbI {
  const t = useNuxtApp().$i18n.t
  return {
    text: t('pageHeadings.siManagement'),
    to: { name: RouteNameE.STAFF_SI_DASH }
  }
}
export function getBcrosStaffReqViewCrumb (): BreadcrumbI {
  const omitIndividual = useOmitIndividual()
  const route = useRoute()
  return {
    text: omitIndividual?.activeRequest?.value?.fullName ||
      omitIndividual?.activeRequest?.fullName ||
      route?.params?.identifier ||
      'Loading...'
  }
}
