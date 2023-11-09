export default defineNuxtRouteMiddleware((to) => {
  to.meta.breadcrumbs = [
    () => ({ text: 'crumb 1' }),
    () => ({ text: 'crumb 2' }),
    () => ({ text: 'crumb 3' })]
})
