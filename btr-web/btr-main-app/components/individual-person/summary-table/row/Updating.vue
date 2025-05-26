<script setup lang="ts">
import { type SiSchemaType } from '~/utils/si-schema/definitions'
defineProps<{ si: SiSchemaType }>()
</script>

<template>
  <tr class="bg-gray-100 animate-pulse" data-cy="summary-table-row-updating">
    <td>
      <PersonInfoName
        :item="{
          'legalName': si.name.fullName,
          'alternateName': si.name.preferredName,
          'birthDate': si.birthDate}"
      />
      <div class="h-8 mt-2 bg-gray-300 rounded" />
    </td>
    <td>
      <PersonInfoDetails :item="si" />
    </td>
    <td>
      <PersonInfoControl :item="si" />
    </td>
    <td>
      <div class="h-8 bg-gray-300 rounded" />
      <div class="h-8 mt-2 bg-gray-300 rounded" />
    </td>
    <td>
      <div class="h-8 bg-gray-300 rounded" />
    </td>
  </tr>
</template>
<style scoped>
td {
  @apply px-3 py-4 align-top whitespace-normal text-sm text-gray-700
}
</style>
