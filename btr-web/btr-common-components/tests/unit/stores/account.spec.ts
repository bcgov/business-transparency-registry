import { describe, expect, it, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { testParsedToken, testUserSettings } from '../utils/mockedData'
import { useBcrosAccount } from '@/stores/account'
import { useBcrosKeycloak } from '@/stores/keycloak'

describe('Account Store Tests', () => {
  let account: any
  let keycloak: any
  // axios mocks
  const mockProfile = { firstName: 'Test', lastName: 'TEST' }
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
    // account uses kcUser which is based off this
    keycloak.kc.tokenParsed = testParsedToken

    account = useBcrosAccount()
    // for some reason these don't initialize properly
    account.user = computed(() => keycloak.kcUser)
    account.userFirstName = ref(account.user.firstName)
    account.userLastName = ref(account.user.lastName)
  })

  afterEach(() => vi.clearAllMocks())

  it('renders default state/getters as expected', () => {
    expect(account.currentAccount).toEqual({})
    expect(account.currentAccountName).toBe('')
    expect(account.user).toEqual(keycloak.kcUser)
    expect(account.userFirstName).toBe(testParsedToken.firstname)
    expect(account.userLastName).toBe(testParsedToken.lastname)
    expect(account.errors).toEqual([])
  })

  it('sets name values as expected when setUserName is called (non BCeId)', async () => {
    expect(account.user.loginSource).not.toBe(LoginSourceE.BCEID)
    await account.setUserName()
    expect(axiosMocks.get).not.toHaveBeenCalled()
    expect(account.userFirstName).toBe(testParsedToken.firstname)
    expect(account.userLastName).toBe(testParsedToken.lastname)
  })

  it('sets name values as expected when setUserName is called (BCeId)', async () => {
    keycloak.kc.tokenParsed.loginSource = LoginSourceE.BCEID
    account.user.value = keycloak.kcUser
    expect(account.user.loginSource).toBe(LoginSourceE.BCEID)
    expect(axiosMocks.get).not.toHaveBeenCalled()
    await account.setUserName()
    expect(axiosMocks.get).toHaveBeenCalledOnce()
    expect(axiosMocks.get).toHaveBeenCalledWith('/users/@me')
    expect(axiosMocks.get).toHaveReturnedWith({ data: mockProfile })
  })

  it('sets account values as expected when setAccountInfo is called', async () => {
    expect(axiosMocks.get).not.toHaveBeenCalled()
    expect(sessionStorage.getItem(SessionStorageKeyE.CURRENT_ACCOUNT)).toBeNull()
    await account.setAccountInfo()
    expect(axiosMocks.get).toHaveBeenCalledOnce()
    expect(axiosMocks.get).toHaveBeenCalledWith(`/users/${account.user.keycloakGuid}/settings`)
    expect(account.currentAccount).toEqual(testUserSettings[0])
    expect(sessionStorage.getItem(SessionStorageKeyE.CURRENT_ACCOUNT)).toBe(JSON.stringify(testUserSettings[0]))
    // test setting the current account to the 2nd value
    sessionStorage.setItem(SessionStorageKeyE.CURRENT_ACCOUNT, JSON.stringify(testUserSettings[1]))
    await account.setAccountInfo()
    expect(account.currentAccount).toEqual(testUserSettings[1])
  })
})
