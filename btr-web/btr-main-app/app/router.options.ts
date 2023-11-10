import type { RouterConfig } from '@nuxt/schema'
import { RouteNameE } from '../enums/route-name-e'
import { getBusinessDashboardCrumb, getBusinessNameCrumb } from '~/utils/breadcrumbs'

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
        preloadBusinessInfo: true,
        title: 'Beneficial Owner Change'
      }
    }
  ]
}
