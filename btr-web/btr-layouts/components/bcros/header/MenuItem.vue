<template>
  <MenuItem v-slot="{ active }">
    <button
      class="flex px-4 py-3 w-full"
      :class="{ 'text-bcGovColor-activeBlue bg-bcGovColor-gray1': active || itemInfo.setActive }"
      @click="executeAction()"
    >
      <UIcon v-if="itemInfo.icon" class="text-lg self-center mr-2" :name="itemInfo.icon" />
      <div v-else class="pl-[26px]" />
      {{ itemInfo.label }}
    </button>
  </MenuItem>
</template>

<script setup lang="ts">
import { MenuItem } from '@headlessui/vue'
const props = defineProps<{
  itemInfo: { label: string, icon?: string, setActive?: boolean, action?:() => any }
}>()

const executeAction = () => {
  if (props.itemInfo.action) {
    props.itemInfo.action()
  }
}
</script>

<style scoped>
</style>
