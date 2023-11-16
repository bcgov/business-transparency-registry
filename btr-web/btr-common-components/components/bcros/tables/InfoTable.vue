<template>
  <UTable
    :ui="{
      base: 'min-w-[0px]',
      divide: 'divide-none',
      tbody: 'divide-none',
      td: { base: 'align-text-top', color: 'text-gray-700' }
    }"
    :rows="items"
    :columns="headers"
  >
    <template #label-data="{ row }">
      <slot :name="'label-' + row.slot" :row="row">
        <p class="font-bold text-gray-800">
          {{ row.label }}
        </p>
        <p v-if="row.subLabel" class="text-gray-700 text-xs">
          {{ row.subLabel }}
        </p>
      </slot>
    </template>
    <template #info-data="{ row }">
      <slot :name="'info-' + row.slot" :row="row">
        <p>{{ row.info }}</p>
      </slot>
    </template>
  </UTable>
</template>

<script setup lang="ts">
defineProps<{ items: InfoTableItemI[] }>()
const headers = [
  { key: 'label' },
  { key: 'info' }
]
</script>

<style scoped>
</style>
