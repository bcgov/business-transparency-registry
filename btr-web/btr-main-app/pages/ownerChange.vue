<template>
  <div>
    <div class="p-10 bg-white rounded flex">
      <div class="p-5 flex-none w-1/5 col-auto">
        <span class="font-bold">Add an individual person</span>
      </div>
      <div class="p-5 flex-none w-4/5">
        <IndividualPersonAddNew />
      </div>
    </div>
    <IndividualPersonSummaryTable class="mt-5" :individuals="currentSIFiling.significantIndividuals || []" />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

const significantIndividuals = useSignificantIndividuals()
const { currentSIFiling } = storeToRefs(significantIndividuals)

onBeforeMount(async () => {
  const identifier = useRoute().params.identifier as string
  // FUTURE: put in a loading page or something while this happens in case network is slow
  await useBcrosBusiness().loadBusiness(identifier)
  await significantIndividuals.filingInit(identifier)
})

</script>

<style scoped>

</style>
