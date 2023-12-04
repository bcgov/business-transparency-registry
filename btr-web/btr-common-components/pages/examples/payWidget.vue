<script setup lang="ts">

import { FeesI } from '~/interfaces/fees-i'


const fees: FeesI[] = [
  { name: 'Significant Individual Change', amount: 13 },
  { name: 'Service Charge', amount: 2.04 }
]

</script>

<template>
  <BcrosWidgetsFee :fees="fees" />
  <hr>
</template>

<style scoped>

</style>
