import { KeycloakConfig } from 'keycloak-js'

/** Manages auth flows */
export const useAuth = () => {
  const config = useRuntimeConfig()
  const keycloak = useBcrosKeycloak()
  const account = useBcrosAccount()
  const authenticated = ref(false)

  /** Redirect to bcros login page given the login type. */
  function goToLogin (idpHint: string) {
    const loginURL = config.public.registryHomeURL + 'signin'
    window.location.assign(`${loginURL}/${idpHint}`)
  }

  /** Logout and then redirect to given page (if redirect provided). */
  function logout (redirect: string) {
    keycloak.logout()
    if (redirect) {
      window.location.assign(redirect)
    }
  }

  /** Setup keycloak / user auth pieces */
  async function setupAuth (kcConfig: KeycloakConfig) {
    if (!authenticated.value) {
      console.info('Initializing auth setup...')
      const token = sessionStorage.getItem(SessionStorageKeyE.KeyCloakToken) || undefined
      const refreshToken = sessionStorage.getItem(SessionStorageKeyE.KeyCloakTokenRefresh) || undefined
      const idToken = sessionStorage.getItem(SessionStorageKeyE.KeyCloakTokenId) || undefined
      // initialize keycloak with user token
      console.info('Initializing Keycloak...')
      authenticated.value = await keycloak.initKeyCloak(kcConfig, token, refreshToken, idToken)
      if (authenticated.value) {
        // successfully initialized so setup other pieces
        keycloak.syncSessionStorage()
        keycloak.scheduleRefreshToken()
        // set user info
        console.info('Setting user name...')
        await account.setUserName()
        // set account info
        console.info('Setting user account information...')
        await account.setAccountInfo()
        // check account status
        console.info('Checking account status...')
        // redirect if account status is suspended
        const accountStatus = account.currentAccount?.accountStatus
        if (accountStatus) {
          if ([AccountStatusE.NSF_SUSPENDED, AccountStatusE.SUSPENDED].includes(accountStatus)) {
            window.location.assign(`${config.public.authWebURL}/account-freeze`)
          } else if (accountStatus === AccountStatusE.PENDING_STAFF_REVIEW) {
            const accountName = encodeURIComponent(btoa(account.currentAccountName || ''))
            window.location.assign(`${config.public.authWebURL}/pendingapproval/${accountName}/true`)
          }
        }
        console.info('Auth setup complete.')
      }
    }
  }

  return {
    authenticated,
    goToLogin,
    logout,
    setupAuth
  }
}
