import { describe, expect, it, vi } from 'vitest'
import { setActivePinia, createPinia, storeToRefs } from 'pinia'
import { axiosRequestMocks, axiosDefaultMock } from '../utils/mockedAxios'
import { testBusinessBEN, testBusinessSP } from '../utils/mockedData'
import { useBcrosBusiness } from '@/stores/business'

describe('Business Store Tests', () => {
  setActivePinia(createPinia())
  const business = useBcrosBusiness()
  const { currentBusiness, currentBusinessIdentifier, currentBusinessName } = storeToRefs(business)
  // axios mocks
  vi.mock('axios', () => { return { default: { ...axiosDefaultMock } } })

  beforeEach(() => {
    currentBusiness.value = {} as BusinessI
  })

  afterEach(() => vi.clearAllMocks())

  it('renders default state/getters as expected', () => {
    expect(currentBusiness.value).toEqual({})
    expect(currentBusinessIdentifier.value).toBe(undefined)
    expect(currentBusinessName.value).toBe(undefined)
  })

  it('maps the correct business name / identifier of the loaded business', () => {
    // Corporation
    currentBusiness.value = testBusinessBEN.business
    expect(currentBusinessIdentifier.value).toBe(testBusinessBEN.business.identifier)
    expect(currentBusinessName.value).toBe(testBusinessBEN.business.legalName)
    // FIRM
    currentBusiness.value = testBusinessSP.business
    expect(currentBusinessIdentifier.value).toBe(testBusinessSP.business.identifier)
    expect(currentBusinessName.value).toBe(testBusinessSP.business.alternateNames[0].operatingName)
  })

  it('retrieves business data when getBusinessDetails is called', async () => {
    expect(axiosRequestMocks.get).not.toHaveBeenCalled()
    const businessDetails = await business.getBusinessDetails(testBusinessBEN.business.identifier, { slim: true })
    expect(axiosRequestMocks.get).toHaveBeenCalledOnce()
    expect(axiosRequestMocks.get).toHaveBeenCalledWith(
      `https://legal-api-dev.apps.silver.devops.gov.bc.ca/api/v2/businesses/${testBusinessBEN.business.identifier}`,
      { params: { slim: true } }
    )
    expect(axiosRequestMocks.get).toHaveReturnedWith({ data: testBusinessBEN })
    expect(businessDetails).toBeDefined()
    if (businessDetails) {
      // if condition required for typing due to possible void response
      expect(businessDetails.identifier).toBe(testBusinessBEN.business.identifier)
      expect(businessDetails.legalName).toBe(testBusinessBEN.business.legalName)
    }
  })

  it('loads corresponding business data into the store when load business is called', async () => {
    await business.loadBusiness(testBusinessBEN.business.identifier)
    expect(currentBusiness.value).toEqual(testBusinessBEN.business)
    expect(currentBusinessIdentifier.value).toEqual(testBusinessBEN.business.identifier)
    expect(currentBusinessName.value).toEqual(testBusinessBEN.business.legalName)
  })

  it('does not load corresponding business data if it is already cached when load business is called', async () => {
    currentBusiness.value = testBusinessBEN.business
    expect(axiosRequestMocks.get).not.toHaveBeenCalled()
    await business.loadBusiness(testBusinessBEN.business.identifier)
    expect(axiosRequestMocks.get).not.toHaveBeenCalled()
  })

  it('loads corresponding business data if a different business is cached when load business is called', async () => {
    currentBusiness.value = testBusinessSP
    expect(axiosRequestMocks.get).not.toHaveBeenCalled()
    await business.loadBusiness(testBusinessBEN.business.identifier)
    expect(axiosRequestMocks.get).toHaveBeenCalledOnce()
    expect(currentBusiness.value).toEqual(testBusinessBEN.business)
  })

  it('loads corresponding business data if business is cached when load business is called with force', async () => {
    currentBusiness.value = testBusinessBEN
    expect(axiosRequestMocks.get).not.toHaveBeenCalled()
    await business.loadBusiness(testBusinessBEN.business.identifier, true)
    expect(axiosRequestMocks.get).toHaveBeenCalledOnce()
  })
})
