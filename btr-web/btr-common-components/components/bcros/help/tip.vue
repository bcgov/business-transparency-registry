<template>
  <div class="w-full py-2">
    <div class="cursor-pointer text-blue-500 font-bold flex flex-row items-center" @click="isExpanded = !isExpanded">
      <UIcon
        name="i-mdi-help-circle-outline"
        class="my-1 text-2xl font-bold"
      />
      <p class="px-1.5">
        {{ (isExpanded && titleExpanded) ? titleExpanded : title }}
      </p>
    </div>
    <div v-if="isExpanded" class="my-2 py-2">
      <div class="flex w-full items-center">
        <slot name="default">
          {{ text }}
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  text: { type: String, required: false, default: '' },
  title: { type: String, required: false, default: '' },
  titleExpanded: { type: String, required: false, default: '' }
})
const isExpanded = ref(false)

</script>
