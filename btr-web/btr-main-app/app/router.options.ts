import type { RouterConfig } from '@nuxt/schema'
import { RouteNameE } from '../enums/route-name-e'
import {
  getBusinessDashboardCrumb,
  getBusinessNameCrumb,
  getMyRegDetailsCrumb,
  getRequestOmitCrumb
} from '~/utils/breadcrumbs'

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
        buttonControl: {
          leftButtons: [getSIChangeCancel, getSIChangeSaveExit, getSIChangeSave],
          rightButtons: [getSIChangeBack, getSIChangeSubmit]
        },
        layout: 'business'
      }
    },
    {
      name: RouteNameE.REQUEST_OMIT,
      path: '/request-to-omit',
      component: () => import('~/pages/requestToOmit.vue').then(r => r.default || r),
      meta: {
        breadcrumbs: [getBcrosHomeDashboardCrumb, getRequestOmitCrumb],
        layout: 'omit',
        title: 'Request to Omit Information',
        buttonControl: {
          leftButtons: [],
          rightButtons: [getOmitSubmitButton]
        }
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
    },
    {
      name: RouteNameE.STAFF_SI_DASH,
      path: '/staff-si-dashboard',
      component: () => import('~/pages/staffRequestDash.vue').then(r => r.default || r),
      meta: {
        breadcrumbs: [getBcrosStaffDashboardCrumb, getBcrosStaffSIDashCrumb],
        layout: 'omit',
        title: 'Staff Dashboard',
        buttonControl: {
          leftButtons: [],
          rightButtons: []
        }
      }
    },
    {
      name: RouteNameE.STAFF_REQ_VIEW,
      path: '/staff-request-view/:identifier',
      component: () => import('~/pages/staffRequestView.vue').then(r => r.default || r),
      meta: {
        breadcrumbs: [getBcrosStaffDashboardCrumb, getBcrosStaffSIDashCrumb, getBcrosStaffReqViewCrumb],
        layout: 'omit',
        title: 'Staff Request Review',
        buttonControl: {
          leftButtons: [],
          rightButtons: [getStaffReviewBack, getStaffReviewSubmitButton]
        }
      }
    }
  ]
}
