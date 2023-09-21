<template>
  <div class="mx-5 bg-white rounded-[5px] px-10 py-5">
    <UTable :rows="individuals" :columns="headers" class="bg-white min-w-[30%]">
      <template #fullName-data="{ row }">
        <span class="font-bold text-black ">
        <UIcon name="i-mdi-user" />
        {{ row.fullName }}
        </span>
      </template>

      <template #significanceDates-data="{ row }">
        {{ row?.significanceDates[0] }} to
        {{ !!row?.significanceDates?.[1] ? row.significanceDates[1] : 'Current' }}
      </template>

      <template #details-data="{ row }">
        <div class="px-6 py-3 align-top min-w-[120px]">
          {{ row.details?.dateOfBirth }}<br>
          <span v-for="taxResidency in row.details?.taxResidency">{{ taxResidency }}<br></span>
          <!-- todo: internationalize tax resident -->
          <span>Tax Resident</span>
        </div>
      </template>

      <template #actions-data>
        <ULink>
          <span class="text-blue-700">
            <UIcon name="i-mdi-edit" />
            Change
          </span>
        </ULink>
      </template>
    </UTable>
  </div>
</template>

<script setup lang="ts">
import { IndividualPersonInterface } from '~/models/persons'

const headers = [
  { key: 'fullName', label: 'Name' },
  { key: 'address', label: 'Address' },
  { key: 'details', label: 'Details' },
  { key: 'significanceDates', label: 'Significance Dates' },
  { key: 'controlsText', label: 'Controls' },
  { key: 'actions' }
]

defineProps({
  individuals: {
    type: Array<IndividualPersonInterface>,
    required: true
  }
})
</script>

<style scoped>

</style>
