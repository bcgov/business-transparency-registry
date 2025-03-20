import { CompletingPartySchemaType, OmitObscureSchemaType, SiBizInfoSchemaType } from '~/utils/omit-schema/definitions'
import {
  getDefaultInputFormCompletingParty,
  getDefaultInputFormOmitObscure,
  getDefaultInputFormSiBiz
} from '~/utils/omit-schema/defaults'
import {
  BtrBodsRequestGetI,
  BtrBodsRequestGetAllI,
  BtrBodsRequestI,
  BtrBodsRequestQueryI
} from '~/interfaces/btr-bods/btr-bods-request-i'

export const useOmitIndividual = defineStore('bcros/omitIndividual', () => {
  const completingParty: Ref<CompletingPartySchemaType> = ref(getDefaultInputFormCompletingParty())
  const errors: Ref<ErrorI[]> = ref([])
  const completingPartyRef = ref()
  const omitObscureRef = ref()
  const omitObscure: Ref<OmitObscureSchemaType> = ref(getDefaultInputFormOmitObscure())
  const siBizRef = ref()
  const siBiz: Ref<SiBizInfoSchemaType> = ref(getDefaultInputFormSiBiz())
  const siBizName = ref('')
  const submitting = ref(false)
  const submitted = ref(false)
  const allRequests = ref([])
  const activeRequest = ref({})
  const activeComments = ref([])
  const activeId = ref(-1)
  const activeUUID = ref('')
  const requestCount = ref(0)
  const bizInfo = ref({})
  const staffComment = ref('')
  const changeState = ref('')

  const constructBtrApiURL = () => {
    const runtimeConfig = useRuntimeConfig()
    const btrApiURL = runtimeConfig.public.btrApiURL
    return `${btrApiURL}`
  }

  function assembleSubmitData (): BtrBodsRequestI {
    return {
      fullName: siBiz.value.name,
      birthdate: siBiz.value.birthdate,
      email: siBiz.value.email,
      businessIdentifier: siBiz.value.businessId,
      informationToOmit: omitObscure.value.infoToOmit,
      individualAtRisk: omitObscure.value.individualsAtRisk,
      reasons: omitObscure.value.reasons,
      completingParty: completingParty.value.invididualType,
      completingName: completingParty.value.name,
      completingEmail: completingParty.value.email
    }
  }

  function loadData (jsonResp: BtrBodsRequestGetI) {
    siBiz.value.name = jsonResp.fullName
    siBiz.value.birthdate = jsonResp.birthdate
    siBiz.value.email = jsonResp.email
    siBiz.value.businessId = jsonResp.businessIdentifier
    omitObscure.value.infoToOmit = jsonResp.informationToOmit
    omitObscure.value.individualsAtRisk = jsonResp.individualAtRisk
    omitObscure.value.reasons = jsonResp.reasons
    completingParty.value.invididualType = jsonResp.completingParty
    completingParty.value.name = jsonResp.completingName
    completingParty.value.email = jsonResp.completingEmail
    activeId.value = jsonResp.id
    activeUUID.value = jsonResp.uuid
  }

  /** Load all requests **/
  async function loadAllRequests (
    sort?: string,
    filter?: BtrBodsRequestQueryI,
    order?: string,
    page?: Number,
    limit?: Number
  ) {
    const url = constructBtrApiURL() + '/requests'

    const params = {
      ...filter,
      sort,
      order,
      page,
      limit
    }

    const method = 'GET'
    const { data, error } = await useFetchBcros<[BtrBodsRequestGetAllI]>(url,
      {
        method,
        query: params
      })
    if (error && error.value) {
      if (error?.value?.statusCode && error.value.statusCode >= 500) {
        useGlobalErrorsStore().addGlobalError(SomethingWentWrongError())
      }
      return error
    }
    allRequests.value = data.value.results
    requestCount.value = data.value.count
    for (let i = 0; i < allRequests.value.length; i++) {
      if (!bizInfo.value[allRequests.value[i].businessIdentifier]) {
        useBcrosBusiness().getBusinessDetails(allRequests.value[i].businessIdentifier,
          { slim: true }).then((bizData) => {
          if (bizData) {
            const index = allRequests.value.findIndex((req) => {
              return req.businessIdentifier === bizData.identifier
            })
            bizInfo.value[allRequests.value[index].businessIdentifier] = bizData
            allRequests.value[index].businessInfo = bizData
          }
        })
      } else {
        allRequests.value[i].businessInfo = bizInfo.value[allRequests.value[i].businessIdentifier]
      }
    }
  }

  /** Load the omit individuals for the business into the store */
  async function loadSavedOmitIndividual (uuid: string) {
    const url = constructBtrApiURL() + `/requests/${uuid}`
    const method = 'GET'
    const { data, error } = await useFetchBcros<BtrBodsRequestGetI>(url,
      {
        method
      })
    if (error?.value?.statusCode && error.value.statusCode >= 500) {
      useGlobalErrorsStore().addGlobalError(SomethingWentWrongError())
    }
    activeRequest.value = data.value
    changeState.value = activeRequest?.value?.status
    activeRequest.value.business = {}
    useBcrosBusiness().getBusinessDetails(activeRequest.value.businessIdentifier,
      { slim: true }).then((bizData) => {
      if (bizData) {
        activeRequest.value.business = bizData
      }
    })
    getCommentsForRequest(activeRequest.value.uuid)

    return { data, error }
  }

  /** Create the omit individuals in the api */
  async function createSavedOmitIndividual () {
    const url = constructBtrApiURL() + '/requests'
    const method = 'POST'
    const submitData = assembleSubmitData()
    const { data, error } = await useFetchBcros<BtrBodsRequestGetI>(url,
      {
        method,
        body: submitData,
        headers: { 'Content-Type': 'application/json' }
      })
    if (error?.value?.statusCode && error.value.statusCode >= 500) {
      useGlobalErrorsStore().addGlobalError(SomethingWentWrongError())
    }
    return { data, error }
  }

  /** Create the omit individuals in the api */
  async function updateSavedOmitIndividual (uuid: string, status: string): Promise<boolean> {
    const url = `${constructBtrApiURL()}/requests/${uuid}`
    const method = 'PUT'
    const { error } = await useFetchBcros<BtrBodsRequestGetI>(url,
      {
        method,
        body: { status },
        headers: { 'Content-Type': 'application/json' }
      })
    if (error?.value?.statusCode && error.value.statusCode >= 500) {
      useGlobalErrorsStore().addGlobalError(SomethingWentWrongError())
    }
    if (error?.value) {
      return false
    }
    return true
  }

  async function submitOmit () {
    if (submitting.value) {
      return
    }
    submitting.value = true
    if (!completingPartyRef.value) {
      console.error('Completing Party Ref missing')
      submitting.value = false
      return
    }
    if (!omitObscureRef.value) {
      console.error('Omit Obscure Ref missing')
      submitting.value = false
      return
    }
    if (!siBizRef.value) {
      console.error('Si Biz Ref missing')
      submitting.value = false
      return
    }
    await completingPartyRef.value.validate()
    await omitObscureRef.value.validate()
    await siBizRef.value.validate()
    errors.value = [
      ...completingPartyRef.value.completingPartyForm.errors,
      ...omitObscureRef.value.omitObscureForm.errors,
      ...siBizRef.value.siBizForm.errors]
    if (errors.value.length === 0) {
      const { error } = await createSavedOmitIndividual()
      if (error && error.value) {
        console.error('Error submitting: ', error.value)
        submitting.value = false
        return
      }
      submitted.value = true
      submitting.value = false
      await navigateTo(RouteNameE.REQUEST_OMIT_SUBMITTED)
    } else {
      submitting.value = false
      console.error('Fix errors before submitting, ', errors.value)
    }
  }

  async function submitStaffReview () {
    if (!activeRequest || !activeRequest.value || !activeRequest.value.uuid) {
      return false
    }
    let success = true
    if (staffComment.value && staffComment.value.length > 0) {
      success = await createComment(activeRequest.value.uuid, staffComment.value)
    }
    if (changeState.value && changeState.value.length > 0 && changeState.value !== activeRequest.value.status) {
      success = success && await updateSavedOmitIndividual(activeRequest.value.uuid, changeState.value)
    }

    if (success) {
      useRouter().push({ name: RouteNameE.STAFF_SI_DASH })
    }
  }

  async function createComment (relatedUuid: string, comment: string): Promise<boolean> {
    const url = constructBtrApiURL() + `/requests/${relatedUuid}/comment`
    const method = 'POST'
    const submitData = {
      text: comment
    }
    const { error } = await useFetchBcros(url,
      {
        method,
        body: submitData,
        headers: { 'Content-Type': 'application/json' }
      })
    if (error?.value?.statusCode && error.value.statusCode >= 500) {
      useGlobalErrorsStore().addGlobalError(SomethingWentWrongError())
    }
    if (error?.value) {
      return false
    }
    return true
  }

  async function getCommentsForRequest (requestUuid: string) {
    const url = constructBtrApiURL() + `/requests/${requestUuid}/comment`
    const method = 'GET'
    const { data, error } = await useFetchBcros(url,
      {
        method,
        headers: { 'Content-Type': 'application/json' }
      })
    if (error?.value?.statusCode && error.value.statusCode >= 500) {
      useGlobalErrorsStore().addGlobalError(SomethingWentWrongError())
    }
    activeComments.value = data.value
    return { data }
  }

  return {
    loadSavedOmitIndividual,
    loadData,
    loadAllRequests,
    createSavedOmitIndividual,
    errors,
    completingParty,
    completingPartyRef,
    submitOmit,
    omitObscure,
    omitObscureRef,
    siBiz,
    siBizRef,
    siBizName,
    submitting,
    submitted,
    allRequests,
    activeId,
    activeUUID,
    createComment,
    getCommentsForRequest,
    requestCount,
    bizInfo,
    activeRequest,
    activeComments,
    submitStaffReview,
    staffComment,
    changeState,
    updateSavedOmitIndividual
  }
})
