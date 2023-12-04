<template>
  <div class="w-[282px] bg-white p-0" data-cy="pay-fees-widget">
    <BcrosCard>
      <template #header>
        <slot name="header">
          <div
            class="bg-bcGovColor-header text-white h-bcrosRow font-bold p-3 rounded-t-md"
            data-cy="pay-fees-widget-title"
          >
            {{ $t('widgets.feeSummary.title') }}
          </div>
        </slot>
      </template>
      <template #default>
        <slot v-if="hasEmptyFees" name="emptyFees" data-cy="pay-fees-widget-empty-fees" />
        <slot name="default">
          <div
            v-for="fee in fees"
            :key="fee.uiUuid"
            class="bg-white p-3 border-gray-300 border-b-[1px] flex"
          >
            <span class="font-bold text-sm mr-auto">
              {{ $t(`widgets.feeSummary.itemLabels.${fee.filingTypeCode}`) }}
            </span>
            <span v-if="fee.quantity > 1" class="font-normal text-sm text-gray-400 float-right ml-2">
              {{ `X${fee.quantity}` }}
            </span>
            <span class="font-bold text-sm float-right ml-2 overflow-hidden whitespace-nowrap">
              ${{ fee.total === 0 ? $t('widgets.feeSummary.noFee') : displayCanadianDollars(fee.total) }}
            </span>
          </div>
        </slot>
      </template>
      <template #footer>
        <slot name="footer">
          <div class="bg-white rounded-b-md shadow-md p-3 items-center flex" data-cy="pay-fees-widget-total">
            <span class="font-bold text-sm mr-auto">
              {{ $t('widgets.feeSummary.total') }}
            </span>
            <span class="font-normal text-sm text-gray-400 float-right ml-2">
              {{ $t('currency.cad') }}
            </span>
            <span
              v-if="fees?.length > 0"
              class="font-bold text-2xl float-right ml-2 overflow-hidden whitespace-nowrap"
            >
              ${{ displayCanadianDollars(total) }}
            </span>
            <span
              v-else
              class="font-bold text-2xl float-right ml-2 overflow-hidden whitespace-nowrap"
            >
              -
            </span>
          </div>
        </slot>
      </template>
    </BcrosCard>
  </div>
</template>

<script setup lang="ts">
import { PayFeesWidgetItemI } from '~/interfaces/fees-i'

const props = defineProps({
  fees: { type: Array<PayFeesWidgetItemI>, required: true }
})

const hasEmptyFees = computed(() => !props.fees?.length)

const displayCanadianDollars = (amount: number) => {
  return `${(amount.toFixed(2))}`
}

const total = computed(() => {
  return props.fees.reduce((total, feeInfo) => total + feeInfo.total, 0)
})
</script>
