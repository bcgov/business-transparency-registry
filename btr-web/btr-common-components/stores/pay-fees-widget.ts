import { defineStore } from 'pinia'
import { v4 as UUIDv4 } from 'uuid'
import { Ref } from 'vue'
import { StatusCodes } from 'http-status-codes'

import { FeeInfoI, PayFeesWidgetItemI } from '~/interfaces/fees-i'
import { ErrorI } from '~/interfaces/error-i'
import { FilingDataI } from '~/interfaces/filling-data-i'

import payApi from '~/services/pay-api'

export const usePayFeesWidget = defineStore('payFeeWidget', () => {
  const errors: Ref<ErrorI[]> = ref([])

  const fees: Ref<PayFeesWidgetItemI[]> = ref([])
  const folioNumber = ref('')

  const feeInfo: Ref<[FilingDataI, FeeInfoI][]> = ref([])

  const addFee = (newFee: FeeInfoI) => {
    const index = fees.value.findIndex(fee =>
      fee.filingType === newFee.filingType && fee.filingTypeCode === newFee.filingTypeCode
    )

    if (index === -1) {
      fees.value.push({ ...newFee, quantity: 1, uiUuid: UUIDv4() })
    }
  }

  const addFeeOrIncreaseCount = (feeToAdd: FeeInfoI) => {
    const fee = fees.value.find(fee =>
      fee.filingType === feeToAdd.filingType && fee.filingTypeCode === feeToAdd.filingTypeCode
    )

    if (fee) {
      if (fee.quantity === undefined) {
        fee.quantity = 0
      } else {
        fee.quantity += 1
      }
    } else {
      addFee(feeToAdd)
    }
  }

  const removeFee = (feeToRemove: FeeInfoI) => {
    const index = fees.value.findIndex(fee =>
      fee.filingType === feeToRemove.filingType && fee.filingTypeCode === feeToRemove.filingTypeCode
    )
    if (index > -1) { // only splice array when item is found
      fees.value.splice(index, 1)
    }
  }

  const removeFeeOrDecreaseCount = (feeToRemove: FeeInfoI) => {
    const fee = fees.value.find(fee =>
      fee.filingType === feeToRemove.filingType && fee.filingTypeCode === feeToRemove.filingTypeCode
    )

    if (fee?.quantity && fee.quantity > 1) {
      fee.quantity -= 1
    } else {
      removeFee(feeToRemove)
    }
  }

  const loadFeeTypesAndCharges = async (newFolioNumber: string, filingData: FilingDataI[]) => {
    folioNumber.value = newFolioNumber

    for (const filingDataItem of filingData) {
      await payApi.getFeeInfo(filingDataItem)
        .then(({ data, error }) => {
          if (error) {
            console.error(error)
            const err = {
              statusCode: error.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR,
              message: error.message,
              category: ErrorCategoryE.FEE_INFO
            }
            errors.value.push(err)
          }
          if (data) {
            feeInfo.value.push([filingDataItem, data])
          }
        })
    }
  }

  const getFeeInfo =
          async (searchFilingData: FilingDataI, tryLoadIfNotCached: boolean = true): Promise<FeeInfoI | undefined> => {
            const feeInfoItem = feeInfo.value.find(
              ([fillingData, _]) =>
                fillingData.entityType === searchFilingData.entityType &&
                fillingData.filingTypeCode === searchFilingData.filingTypeCode
            )

            if (feeInfoItem) {
              return feeInfoItem[1]
            } else if (!feeInfoItem && tryLoadIfNotCached) {
              await loadFeeTypesAndCharges(folioNumber.value, [searchFilingData])
              return getFeeInfo(searchFilingData, false)
            }
            return undefined
          }

  return {
    errors,
    fees,
    folioNumber,
    feeInfo,
    loadFeeTypesAndCharges,
    addFee,
    addFeeOrIncreaseCount,
    removeFee,
    removeFeeOrDecreaseCount,
    getFeeInfo
  }
})
