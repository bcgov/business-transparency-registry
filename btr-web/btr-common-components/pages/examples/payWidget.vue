<script setup lang="ts">

import { type PayFeesWidgetItemI } from '~/interfaces/fees-i'

const fees: PayFeesWidgetItemI[] = [
  {
    uiUuid: '111',
    quantity: 1,
    filingFees: 0,
    filingType: 'Register Significant Individual',
    filingTypeCode: 'REGSIGIN',
    futureEffectiveFees: 0,
    priorityFees: 0,
    processingFees: 0,
    serviceFees: 0,
    tax: { gst: 0, pst: 0 },
    total: 12
  },
  {
    uiUuid: '123',
    quantity: 2,
    filingFees: 0,
    filingType: 'Register Significant Individual2',
    filingTypeCode: 'TEST',
    futureEffectiveFees: 0,
    priorityFees: 0,
    processingFees: 0,
    serviceFees: 0,
    tax: { gst: 0, pst: 0 },
    total: 27.23
  }
]

</script>

<template>
  <BcrosWidgetsFee :fees="fees" />
</template>

<style scoped>

</style>
