export default defineNuxtRouteMiddleware((to) => {
  to.meta.breadcrumbs = [
    () => ({ text: 'crumb 1', href: 'https://dev.bcregistry.gov.bc.ca/login' }),
    () => ({ text: 'crumb 2', href: 'https://dev.account.bcregistry.gov.bc.ca/decide-business' }),
    () => ({ text: 'crumb 3' })]
})
