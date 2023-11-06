import { describe, expect, it, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { testParsedToken, testUserSettings } from '../utils/mockedData'
import { useAuth } from '@/composables/useAuth'
import { useBcrosAccount } from '@/stores/account'
import { useBcrosKeycloak } from '@/stores/keycloak'

describe('useAuth Tests', () => {
  let account: any
  let keycloak: any
  const testToken = 'qjduwe'
  const testTokenRefresh = 'qjduwwewvwe'
  const testTokenId = '12322frwr'
  // axios mocks
  const axiosMocks = vi.hoisted(() => ({
    get: vi.fn().mockImplementation((url: string) => {
      if (url.includes('/users/@me')) {
        return new Promise(resolve => resolve({ data: { firstName: 'Test', lastName: 'TEST' } }))
      } else if (url.includes('settings')) {
        return new Promise(resolve => resolve({ data: testUserSettings }))
      }
    }),
    post: vi.fn()
  }))

  vi.mock('Axios', async (importActual) => {
    const actual = await importActual<typeof import('axios')>()
    const mockAxios = {
      default: {
        ...actual.default,
        create: vi.fn(() => ({
          ...actual.default.create(),
          get: axiosMocks.get,
          post: axiosMocks.post
        }))
      }
    }
    return mockAxios
  })

  beforeEach(() => {
    setActivePinia(createPinia())
    keycloak = useBcrosKeycloak()
    keycloak.initKeyCloak = vi.fn().mockImplementation(() => {
      keycloak.kc.token = testToken
      keycloak.kc.idToken = testTokenId
      keycloak.kc.refreshToken = testTokenRefresh
      keycloak.kc.tokenParsed = testParsedToken
      keycloak.kc.isTokenExpired = vi.fn()
      return true
    })

    account = useBcrosAccount()
    // for some reason these don't initialize properly
    account.user = computed(() => keycloak.kcUser)
    account.userFirstName = ref(account.user.firstName)
    account.userLastName = ref(account.user.lastName)
  })

  afterEach(() => vi.clearAllMocks())

  it('auth setup flow works as expected', async () => {
    // verify setup
    expect(keycloak.kcUser).toEqual({})
    expect(account.user).toEqual({})
    const { setupAuth } = useAuth()
    // execute setupAuth
    await setupAuth({ url: 'kcurl', realm: 'realm', clientId: 'id' })
    // verify things are setup
    expect(keycloak.kc.tokenParsed).toEqual(testParsedToken)
    expect(keycloak.kcUser).not.toEqual({})
    expect(account.user).toEqual(keycloak.kcUser)
    expect(account.userAccounts.length).toBe(2)
    expect(account.currentAccount).toEqual(testUserSettings[0])
    expect(sessionStorage.getItem(SessionStorageKeyE.KEYCLOAK_TOKEN)).toBe(testToken)
    expect(sessionStorage.getItem(SessionStorageKeyE.KEYCLOAK_TOKEN_ID)).toBe(testTokenId)
    expect(sessionStorage.getItem(SessionStorageKeyE.KEYCLOAK_TOKEN_REFRESH)).toBe(testTokenRefresh)
    expect(sessionStorage.getItem(SessionStorageKeyE.KEYCLOAK_SYNCED)).toBe('true')
    expect(sessionStorage.getItem(SessionStorageKeyE.CURRENT_ACCOUNT)).toBe(JSON.stringify(testUserSettings[0]))
  })
})
