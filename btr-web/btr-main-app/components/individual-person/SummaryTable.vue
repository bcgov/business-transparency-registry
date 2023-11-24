<template>
  <div data-cy="individualsSummaryTable" class="bg-white rounded-[5px] px-10 py-5">
    <UTable
      :columns="headers"
      :rows="individuals"
      :empty-state="{ icon: '', label: 'No significant individuals added yet' }"
    >
      <template #fullName-data="{ row }">
        <span class="font-bold text-gray-900">
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
          <span v-for="(residency, index) in row.details?.residency" :key="index">{{ residency }}<br></span>
          <!-- todo: internationalize tax resident -->
          <span v-if="row.details?.isTaxResident">Tax Resident</span>
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
// FUTURE: update this table to follow SignificantIndividualI structure (Part of ticket: #18664)
defineProps<{ individuals: SignificantIndividualI[] }>()

const headers = [
  { key: 'fullName', label: 'Name' },
  { key: 'address', label: 'Address' },
  { key: 'details', label: 'Details' },
  { key: 'significanceDates', label: 'Significance Dates' },
  { key: 'controlsText', label: 'Controls' },
  { key: 'actions' }
]
</script>

<style scoped>

</style>
