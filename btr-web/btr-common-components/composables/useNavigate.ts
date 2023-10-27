export const useNavigate = () => {
  const account = useBcrosAccount()

  function redirect (url: string) {
    // get account id and set in params
    const accountId = account.currentAccount.id
    if (accountId) {
      if (url.slice(-1) === '/') {
        // remove front slash before adding params
        url = url.slice(0, -1)
      }
      if (url.slice(-1) === '?') {
        url += `&accountid=${accountId}`
      } else {
        url += `?accountid=${accountId}`
      }
    }
    // assume URL is always reachable
    window.location.assign(url)
  }

  return {
    redirect
  }
}
