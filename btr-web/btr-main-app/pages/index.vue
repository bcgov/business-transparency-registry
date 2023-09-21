<template>
  <div class="mx-10">
    <div class="mx-5 my-5 p-10 bg-white rounded flex">
      <div class="p-5 flex-none w-1/5 col-auto">
        <span class="font-bold">Add an individual person</span>
      </div>
      <div class="p-5 flex-none w-4/5">
        <AddIndividualPerson />
      </div>
    </div>
    <NUIndividualPersonSummaryTable :individuals="individuals" />
  </div>
</template>

<script setup lang="ts">
import { useIndividualPerson } from '~/store/individual-person'

const individualPersonStore = useIndividualPerson()

const individuals = computed(() => individualPersonStore.getIndividualPersons)

</script>

<style scoped>

</style>
