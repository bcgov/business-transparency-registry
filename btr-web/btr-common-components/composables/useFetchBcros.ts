export const useFetchBcros = <T>(request, opts?) => {
  if (!opts?.headers?.Authorization) {
    const token = useBcrosKeycloak().kc.token

    opts = opts || {}
    Object.assign(opts, { headers: { Authorization: `Bearer ${token}` } })
  }

  return useFetch<T>(request, opts)
}
