import { RouteNameE } from '~/enums/route-name-e'

export default defineNuxtRouteMiddleware((to) => {
  const expectedRoutes = [
    RouteNameE.BEN_OWNR_CHNG,
    RouteNameE.MY_REG_DETAILS,
    RouteNameE.REVIEW_CONFIRM,
    RouteNameE.REQUEST_OMIT,
    RouteNameE.STAFF_SI_DASH
  ]

  // temporary until there is a launch point for this app
  if (!expectedRoutes.includes(to.name as RouteNameE)) {
    let identifier = 'BC0871427' // exists in dev
    const { appEnv } = useRuntimeConfig().public
    if (appEnv === 'test') {
      identifier = 'BC1066187'
    }
    return navigateTo(
      {
        name: RouteNameE.BEN_OWNR_CHNG,
        params: { identifier }
      }
    )
  }
})
