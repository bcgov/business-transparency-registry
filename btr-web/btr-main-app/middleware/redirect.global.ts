export default defineNuxtRouteMiddleware((to) => {
  // temporary until there is a landing page
  if (to.name !== RouteNameE.BEN_OWNR_CHNG) {
    return navigateTo(
      {
        name: RouteNameE.BEN_OWNR_CHNG,
        params: {
          identifier: 'BC0871427' // BCREG2050 or any staff account has access to this one
        }
      }
    )
  }
})
