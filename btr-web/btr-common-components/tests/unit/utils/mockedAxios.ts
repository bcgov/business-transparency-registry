import { vi } from 'vitest'
// import { testProfile, testUserSettings, testBusinessBEN, testBusinessSP, testBusinessContact } from './mockedData'

export const axiosRequestMocks = {}
// todo: re-evaluate if fix or remove this hoisted mock #20310
// export const axiosRequestMocks = vi.hoisted(() => ({
//   get: vi.fn().mockImplementation((url: string, config?: any) => {
//     console.info('Mock is currently not doing anything with config', config)
//     // account GET mocks
//     if (url.includes('/users/@me')) {
//       return new Promise(resolve => resolve({ data: { ...testProfile } }))
//     } else if (url.includes('settings')) {
//       return new Promise(resolve => resolve({ data: [...testUserSettings] }))
//     // business GET mocks
//     } else if (url.includes(`/businesses/${testBusinessBEN.business.identifier}`)) {
//       return new Promise(resolve => resolve({ data: { ...testBusinessBEN } }))
//     } else if (url.includes(`/businesses/${testBusinessSP.business.identifier}`)) {
//       return new Promise(resolve => resolve({ data: { ...testBusinessSP } }))
//     } else if (url.includes('/entities/')) {
//       return new Promise(resolve => resolve({ data: { ...testBusinessContact } }))
//     }
//   })
// }))

export const axiosDefaultMock = {
  post: vi.fn(),
  get: axiosRequestMocks.get,
  delete: vi.fn(),
  put: vi.fn(),
  create: vi.fn().mockReturnThis(),
  interceptors: {
    request: {
      use: vi.fn(),
      eject: vi.fn()
    },
    response: {
      use: vi.fn(),
      eject: vi.fn()
    }
  }
}
