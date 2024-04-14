<template>
  <UFormGroup :label="label" name="email">
    <UInput
      :id="id"
      type="text"
      v-bind="$attrs"
      :value="modelValue"
      :variant="variant"
      :placeholder="placeholder"
      :class="{ 'text-red-500': hasError}"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </UFormGroup>
</template>

<script setup lang="ts">

import type { FormError } from '#ui/types'

defineEmits<{ (e: 'update:modelValue', value: string): void }>()
const props = defineProps({
  label: { type: [String], default: '' },
  placeholder: { type: [String], default: '' },
  id: { type: String, required: true },
  modelValue: { type: String, default: '' },
  errors: { type: Object as PropType<FormError[]>, required: true },
  variant: { type: String, default: 'bcGov' }
})

const hasError = computed(() => props.error?.length > 0)
</script>
