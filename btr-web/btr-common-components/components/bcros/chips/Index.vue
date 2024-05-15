<template>
  <div
    class="grid grid-flow-col gap-1 py-0.5 px-2.5 m-1 rounded-lg bg-primary text-white text-sm"
    data-cy="bcrosChip"
  >
    <div>
      <slot name="col-span-4">
        <span class="align-middle">
          {{ label }}
        </span>
      </slot>
    </div>
    <div v-if="hasClose" class="float-right">
      <slot name="icon">
        <span class="h-full w-full">
          <UIcon
            name="i-mdi-close font-bold align-middle"
            data-cy="close-icon"
            @click.stop.prevent="$emit('chipCloseClicked')"
          />
        </span>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits<(e: 'chipCloseClicked') => void>()
defineProps({
  label: { type: String, required: true },
  hasClose: { type: Boolean, default: false }
})
</script>
