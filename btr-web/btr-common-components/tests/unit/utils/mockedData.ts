export const testParsedToken = {
  firstname: 'First',
  lastname: 'Last',
  name: 'First Last',
  username: 'Username',
  email: 'test@email.com',
  sub: '123456',
  loginSource: 'BCSC',
  realm_access: { roles: ['role1', 'role2'] }
}

export const testProfile = { firstName: 'Test', lastName: 'TEST' }

export const testUserSettings = [
  {
    accountStatus: AccountStatusE.ACTIVE,
    accountType: AccountTypeE.PREMIUM,
    id: 123,
    label: 'Test Dev 1',
    type: UserSettingsTypeE.ACCOUNT
  },
  {
    accountStatus: AccountStatusE.ACTIVE,
    accountType: AccountTypeE.PREMIUM,
    id: 124,
    label: 'Test Dev 2',
    type: UserSettingsTypeE.ACCOUNT
  },
  {
    id: 125,
    label: 'USER PROFILE',
    type: UserSettingsTypeE.USER_PROFILE
  },
  {
    id: 126,
    label: 'CREATE ACCOUNT',
    type: UserSettingsTypeE.CREATE_ACCOUNT
  }
]
