import type { RouterConfig } from '@nuxt/schema'
import { RouteNameE } from '../enums/route-name-e'
import { getBusinessDashboardCrumb, getBusinessNameCrumb, getMyRegDetailsCrumb } from '~/utils/breadcrumbs'

export default <RouterConfig> {
  // https://router.vuejs.org/api/interfaces/routeroptions.html#routes
  // alternatively, could put this inside the setup for each page
  routes: _routes => [
    {
      name: RouteNameE.BEN_OWNR_CHNG,
      path: '/:identifier/beneficial-owner-change',
      component: () => import('~/pages/ownerChange.vue').then(r => r.default || r),
      meta: {
        breadcrumbs: [
          getBcrosHomeDashboardCrumb,
          getBusinessDashboardCrumb,
          getBusinessNameCrumb,
          getBeneficialOwnerChangeCrumb
        ],
        buttonControl: {
          leftButtons: [getSIChangeCancel, getSIChangeSaveExit, getSIChangeSave],
          rightButtons: [getSIChangeConfirm]
        },
        layout: 'business',
        title: 'Beneficial Owner Change'
      }
    },
    {
      name: RouteNameE.REVIEW_CONFIRM,
      path: '/:identifier/beneficial-owner-change/review-confirm',
      component: () => import('~/pages/reviewConfirm.vue').then(r => r.default || r),
      meta: {
        breadcrumbs: [
          getBcrosHomeDashboardCrumb,
          getBusinessDashboardCrumb,
          getBusinessNameCrumb,
          getBeneficialOwnerChangeCrumb
        ],
        buttonControl: { // FUTURE: add buttons
          leftButtons: [],
          rightButtons: []
        },
        layout: 'business'
      }
    },
    {
      name: RouteNameE.MY_REG_DETAILS,
      path: '/my-registries-details',
      component: () => import('~/pages/myRegistriesDetails.vue').then(r => r.default || r),
      meta: {
        breadcrumbs: [getMyRegDetailsCrumb],
        layout: 'person',
        title: 'My BC Registries Details'
      }
    }
  ]
}
