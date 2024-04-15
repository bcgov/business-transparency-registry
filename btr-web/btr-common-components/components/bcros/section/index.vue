<template>
  <div
    class="mt-10 p-10 pt-8 bg-white rounded flex flex-row"
    :class="showSectionHasErrors ? 'border-l-[3px] border-red-500' : ''"
  >
    <slot name="section-title">
      <div class="flex-none w-44 pr-5 pt-3">
        <label class="font-bold min-w-[190px] mt-3" :class="showSectionHasErrors ? 'text-red-500' : ''">
          {{ sectionTitle }}
        </label>
      </div>
    </slot>
    <slot name="default" />
  </div>
</template>

<script setup lang="ts">
defineProps({
  showSectionHasErrors: { type: Boolean, required: false, default: false },
  sectionTitle: { type: String, required: false, default: undefined }
})
</script>
