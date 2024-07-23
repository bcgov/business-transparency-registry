<template>
  <div class="bg-white rounded-[5px] px-10 py-5 relative overflow-visible">
    <table class="min-w-full table-fixed divide-y divide-gray-300">
      <thead>
        <tr>
          <th
            v-for="(header, index) in headers"
            :key="index"
            class="text-left rtl:text-right text-sm font-semibold text-gray-900 px-3 py-3.5"
            :class="header.customStyle ? header.customStyle : ''"
            :style="`width: ${header.width}`"
          >
            {{ header.content }}
          </th>
        </tr>
      </thead>
      <tbody>
        <slot name="warning" />
        <slot v-for="(item, index) in items" :item="item" :index="index" name="table-row" />
        <slot :items="items" name="empty-state">
          <tr v-if="!items.length">
            <td colspan="100%">
              <div class="text-sm text-center text-gray-700 px-3 py-4">
                {{ emptyState }}
              </div>
            </td>
          </tr>
        </slot>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
defineProps({
  headers: { type: Array, required: true },
  items: { type: Array, required: true },
  emptyState: { type: String, default: 'No data available' }
})
</script>

<style scoped>

</style>
