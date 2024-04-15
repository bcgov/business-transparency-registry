<template>
  <div class="w-full py-2 px-2">
    <div class="cursor-pointer text-blue-500 flex flex-row" @click="isExpanded = !isExpanded">
      <UIcon
        name="i-mdi-help-circle-outline"
        class="m-1 text-lg"
      />
      <p class="text-">{{ label }}</p>
    </div>
    <div class="m-2" v-if="isExpanded">
      <div class="flex w-full">
        <slot name="default">{{ text }}</slot>
      </div>
      <div class="m-1 text-blue-500 flex flex-row float-end">
        <p class="cursor-pointer" @click="isExpanded = !isExpanded">Hide help</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  text: { type: string, required: false, default: '' }
  label: { type: string, required: false, default: '' }
}>()
const isExpanded = ref(false)

</script>
