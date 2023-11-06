import { describe, expect, it, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { axiosRequestMocks, axiosDefaultMock } from '../utils/mockedAxios'
import { testParsedToken, testProfile, testUserSettings } from '../utils/mockedData'
import { useBcrosAccount } from '@/stores/account'
import { useBcrosKeycloak } from '@/stores/keycloak'

describe('Account Store Tests', () => {
  let account: any
  let keycloak: any
  // axios mocks
  vi.mock('axios', () => { return { default: { ...axiosDefaultMock } } })

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
    expect(axiosRequestMocks.get).not.toHaveBeenCalled()
    expect(account.userFirstName).toBe(testParsedToken.firstname)
    expect(account.userLastName).toBe(testParsedToken.lastname)
  })

  it('sets name values as expected when setUserName is called (BCeId)', async () => {
    keycloak.kc.tokenParsed.loginSource = LoginSourceE.BCEID
    account.user.value = keycloak.kcUser
    expect(account.user.loginSource).toBe(LoginSourceE.BCEID)
    expect(axiosRequestMocks.get).not.toHaveBeenCalled()
    await account.setUserName()
    expect(axiosRequestMocks.get).toHaveBeenCalledOnce()
    expect(axiosRequestMocks.get).toHaveBeenCalledWith('/users/@me')
    expect(axiosRequestMocks.get).toHaveReturnedWith({ data: testProfile })
  })

  it('sets account values as expected when setAccountInfo is called', async () => {
    expect(axiosRequestMocks.get).not.toHaveBeenCalled()
    expect(sessionStorage.getItem(SessionStorageKeyE.CURRENT_ACCOUNT)).toBeNull()
    await account.setAccountInfo()
    expect(axiosRequestMocks.get).toHaveBeenCalledOnce()
    expect(axiosRequestMocks.get).toHaveBeenCalledWith(`/users/${account.user.keycloakGuid}/settings`)
    expect(account.currentAccount).toEqual(testUserSettings[0])
    expect(sessionStorage.getItem(SessionStorageKeyE.CURRENT_ACCOUNT)).toBe(JSON.stringify(testUserSettings[0]))
    // test setting the current account to the 2nd value
    sessionStorage.setItem(SessionStorageKeyE.CURRENT_ACCOUNT, JSON.stringify(testUserSettings[1]))
    await account.setAccountInfo()
    expect(account.currentAccount).toEqual(testUserSettings[1])
  })
})
