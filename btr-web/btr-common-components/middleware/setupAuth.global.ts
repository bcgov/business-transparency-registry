export default defineNuxtRouteMiddleware(async (to) => {
  // setup auth
  if ((!to.query.error) && !process.env.VITEST_WORKER_ID) {
    // keycloak redirects with the error param when not logged in (nuxt/keycloak issue)
    //   - removing ^ condition will cause an infinite loop of keycloak redirects when not authenticated
    const { kcURL, kcRealm, kcClient } = useRuntimeConfig().public
    await useBcrosAuth().setupAuth(
      { url: kcURL, realm: kcRealm, clientId: kcClient },
      to.params.currentAccountId as string || to.query.currentAccountId as string
    )
  }
  // initialize ldarkly
  useBcrosLaunchdarkly().init()
  // remove query params in url added by keycloak
  if (to.query) {
    const params = new URLSearchParams(to.fullPath.split('?')[1])
    params.delete('state')
    params.delete('session_state')
    params.delete('code')
    params.delete('error')
    to.fullPath = to.path + (params.size > 0 ? `?${params}` : '') + to.hash
  }
})
