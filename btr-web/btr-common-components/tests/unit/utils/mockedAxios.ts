import { vi } from 'vitest'
import { testProfile, testUserSettings } from './mockedData'

export const axiosRequestMocks = vi.hoisted(() => ({
  get: vi.fn().mockImplementation((url: string) => {
    if (url.includes('/users/@me')) {
      return new Promise(resolve => resolve({ data: { ...testProfile } }))
    } else if (url.includes('settings')) {
      return new Promise(resolve => resolve({ data: [...testUserSettings] }))
    }
  })
}))

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
