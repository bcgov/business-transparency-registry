<template>
  <div class="my-[60px]">
    <div class="p-10 bg-white rounded flex">
      <div class="p-5 flex-none w-1/5 col-auto">
        <span class="font-bold">Add an individual person</span>
      </div>
      <div class="p-5 flex-none w-4/5">
        <IndividualPersonAddNew />
      </div>
    </div>
    <IndividualPersonSummaryTable class="mt-5" :individuals="individuals" />
  </div>
</template>

<script setup lang="ts">
import { useIndividualPerson } from '~/store/individual-person'

onBeforeMount(async () => {
  // FUTURE: put in a loading page or something while this happens in case network is slow
  await useBcrosBusiness().loadBusiness(route.params.identifier as string)
})

const route = useRoute()
console.info(route.params.identifier) // Temporary to show how to use identifier. Rmv once this is used elsewhere.

const individualPersonStore = useIndividualPerson()

const individuals = computed(() => individualPersonStore.getIndividualPersons)

</script>

<style scoped>

</style>
