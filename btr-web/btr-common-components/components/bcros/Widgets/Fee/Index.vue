<template>
  <div class="w-[282px] bg-white p-0">
    <BcrosCard>
      <template #header>
        <div class="bg-bcGovColor-header text-white h-bcrosRow font-bold p-3 rounded-t-md">
          {{ $t('widgets.feeSummary.title') }}
        </div>
      </template>
      <template #default>
        <div
          v-for="fee in fees"
          class="bg-white p-3 border-gray-300 border-b-[1px] flex"
        >
          <span class="font-bold text-sm mr-auto">{{ fee.name }}</span>
          <span class="font-bold text-sm float-right ml-2 overflow-hidden whitespace-nowrap">
            {{ fee.amount === 0 ? $t('widgets.feeSummary.noFee') : displayCanadianDollars(fee.amount) }}
          </span>
        </div>
      </template>
      <template #footer>
        <div class="bg-white rounded-b-md shadow-md p-3 items-center flex">
          <span class="font-bold text-sm mr-auto">{{ $t('widgets.feeSummary.total') }}</span>
          <span class="font-normal text-sm text-gray-400 float-right ml-2">CAD</span>
          <span class="font-bold text-2xl float-right ml-2 overflow-hidden whitespace-nowrap">${{ total }}</span>
        </div>
      </template>
    </BcrosCard>
  </div>
</template>

<script setup lang="ts">
import { FeesI } from '~/interfaces/fees-i'

const props = defineProps({
  fees: { type: Array<FeesI> }
})

const displayCanadianDollars = (amount: number) => {
  return `$${(amount.toFixed(2))}`
}

const total = computed(() => {
  return props.fees.reduce((total, { amount }) => total + amount, 0)
})
</script>
