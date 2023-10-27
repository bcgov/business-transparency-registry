import { AxiosInstance } from 'axios'

export function addAxiosInterceptors (axiosInstance: AxiosInstance): AxiosInstance {
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = sessionStorage.getItem(SessionStorageKeyE.KeyCloakToken)
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    err => Promise.reject(err))
  return axiosInstance
}
