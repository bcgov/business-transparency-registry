import { initialize, LDClient, LDFlagSet, LDOptions, LDMultiKindContext } from 'launchdarkly-js-client-sdk'
import { defineStore } from 'pinia'

export const useBcrosLaunchdarkly = defineStore('bcros/launchdarkly', () => {
  const keycloak = useBcrosKeycloak()
  const account = useBcrosAccount()
  const ldClient: Ref<LDClient | null> = ref(null)
  const ldContext = ref({
    kind: 'multi',
    org: { key: 'anonymous' },
    user: { key: 'anonymous' }
  } as LDMultiKindContext)
  const ldFlagSet: Ref<LDFlagSet> = ref({})
  const ldInitialized = ref(false)

  function init () {
    if (ldInitialized.value) {
      console.info('Launchdarkly already initialized.')
      return
    }
    const ldClientId = useRuntimeConfig().public.ldClientId
    if (!ldClientId) {
      console.info('No launchdarkly sdk variable set. Aborting launchdarkly setup.')
      return
    }
    let user: any = { key: 'anonymous' }
    let org: any = { key: 'anonymous' }
    if (keycloak.kc.authenticated) {
      user = {
        key: keycloak.kcUser.keycloakGuid,
        firstName: keycloak.kcUser.firstName,
        lastName: keycloak.kcUser.lastName,
        email: keycloak.kcUser.email,
        roles: keycloak.kcUser.roles,
        loginSource: keycloak.kcUser.loginSource
      }
    }
    if (account.currentAccount.id) {
      org = {
        key: account.currentAccount.id,
        accountType: account.currentAccount.accountType,
        accountStatus: account.currentAccount.accountStatus,
        type: account.currentAccount.type,
        label: account.currentAccount.label
      }
    }
    ldContext.value = { kind: 'multi', org, user }
    const options: LDOptions = {
      streaming: true,
      useReport: true,
      diagnosticOptOut: true
    }
    ldClient.value = initialize(ldClientId, ldContext.value, options)
    ldClient.value.on('initialized', () => {
      ldFlagSet.value = ldClient.value?.allFlags() || {}
      ldInitialized.value = true
      console.info('launchdarkly initialization complete.')
    })
  }

  return {
    ldClient,
    ldContext,
    ldFlagSet,
    ldInitialized,
    init
  }
})
