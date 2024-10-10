export const useFetchBcros = <T>(request, opts?) => {
  if (!opts?.headers?.Authorization) {
    const token = useBcrosKeycloak().kc.token

    opts = opts || {}
    let headers = {}
    if (opts.headers) {
      headers = opts.headers
    }
    Object.assign(opts, { headers: { ...headers, Authorization: `Bearer ${token}` } })
  }
  if (!opts.headers['Account-Id']) {
    opts.headers['Account-Id'] = (useBcrosAccount()).currentAccount?.id
  }

  return useFetch<T>(request, opts)
}
