<template>
  <UFormGroup :label="label">
    <UInput
      :id="id"
      type="text"
      v-bind="$attrs"
      :value="modelValue"
      :variant="variant"
      :placeholder="placeholder"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </UFormGroup>
</template>

<script setup lang="ts">

defineEmits<{(e: 'update:modelValue', value: string): void}>()
defineProps({
  label: { type: [String], default: '' },
  placeholder: { type: [String], default: '' },
  id: { type: String, required: true },
  modelValue: { type: String, default: '' },
  variant: { type: String, default: 'bcGov' }
})
</script>
