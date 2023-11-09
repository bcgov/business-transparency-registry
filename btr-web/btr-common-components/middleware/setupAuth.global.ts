export default defineNuxtRouteMiddleware(async (to) => {
  // setup auth
  if ((!to.hash || !to.hash.includes('#error=login_required')) && !process.env.VITEST_WORKER_ID) {
    // keycloak automatically redirects with this hash when not logged in (unable to figure out how to prevent this)
    //   - removing ^ condition will cause an infinite loop of keycloak redirects when not authenticated
    const { kcURL, kcRealm, kcClient } = useRuntimeConfig().public
    await useBcrosAuth().setupAuth({ url: kcURL, realm: kcRealm, clientId: kcClient })
  }
})
