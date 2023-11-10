import Axios from 'axios'
import { StatusCodes } from 'http-status-codes'
import { defineStore } from 'pinia'
import { BusinessI } from '~/interfaces/business-i'
import { ErrorCategoryE } from '~/enums/error-category-e'
import { ErrorI } from '~/interfaces/error-i'
import { addAxiosInterceptors } from '~/utils/axios'

/** Manages bcros business data */
export const useBcrosBusiness = defineStore('bcros/business', () => {
  const currentBusiness: Ref<BusinessI> = ref({} as BusinessI)
  const currentBusinessIdentifier = computed((): string => currentBusiness.value.identifier)
  const currentBusinessName = computed((): string => {
    if (currentBusiness.value.alternateNames && currentBusiness.value.legalType === BusinessTypeE.SP) {
      return currentBusiness.value.alternateNames[0].operatingName
    }
    return currentBusiness.value.legalName
  })
  // errors
  const errors: Ref<ErrorI[]> = ref([])
  // api request variables
  const axios = addAxiosInterceptors(Axios.create())
  const apiURL = useRuntimeConfig().public.legalApiURL

  /** Return the business details for the given identifier */
  async function getBusinessDetails (identifier: string, params?: object) {
    return await axios.get<{ business: BusinessI }>(`${apiURL}/businesses/${identifier}`, { params })
      .then((response) => {
        const data = response?.data
        if (!data || !data.business) { throw new Error(`Invalid LEGAL API response ${data}`) }
        return data.business
      })
      .catch((error) => {
        console.warn('Error fetching business details for', identifier)
        errors.value.push({
          statusCode: error?.response?.status || StatusCodes.INTERNAL_SERVER_ERROR,
          message: error?.response?.data?.message,
          category: ErrorCategoryE.ENTITY_BASIC
        })
      })
  }

  async function loadBusiness (identifier: string, force = false) {
    const businessCached = currentBusiness && identifier === currentBusinessIdentifier.value
    if (!businessCached || force) {
      const businessDetails = await getBusinessDetails(identifier, { slim: true }) || {} as BusinessI
      currentBusiness.value = businessDetails
    }
  }

  return {
    currentBusiness,
    currentBusinessIdentifier,
    currentBusinessName,
    getBusinessDetails,
    loadBusiness
  }
})
