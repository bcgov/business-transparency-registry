import type { FeeInfoI } from '~/interfaces/fees-i'
import type { FilingDataI, PayFeesApiQueryParamsI } from '~/interfaces/filling-data-i'

const constructFeeInfoURL = (filingData: FilingDataI) => {
  const runtimeConfig = useRuntimeConfig()
  const payApiURL = runtimeConfig.public.payApiURL
  return `${payApiURL}/fees/${filingData.entityType}/${filingData.filingTypeCode}`
}

const getPayFeesApiQueryParams = (filingData: FilingDataI): PayFeesApiQueryParamsI => {
  return {
    waiveFees: filingData.waiveFees || undefined,
    futureEffective: filingData.futureEffective || undefined,
    priority: filingData.priority || undefined
  }
}

const getFeeInfoRefs = async (filingData: FilingDataI) => {
  const url = constructFeeInfoURL(filingData)
  const queryParams = getPayFeesApiQueryParams(filingData)
  const { data, error } = await useFetchBcros<FeeInfoI>(url, { query: queryParams })
  if (error?.value?.statusCode && error.value.statusCode >= 500) {
    useGlobalErrorsStore().addGlobalError(SomethingWentWrongError())
  }
  return { data, error }
}

const getFeeInfo = async (filingData: FilingDataI) => {
  const { data, error } = await getFeeInfoRefs(filingData)

  return { data: data.value, error: error.value }
}

export default {
  getFeeInfoRefs,
  getFeeInfo
}
