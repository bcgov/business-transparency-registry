<template>
  <UFormGroup v-slot="{ error }" :label="label" :name="name">
    <UInput
      :id="id"
      type="text"
      v-bind="$attrs"
      :value="modelValue"
      :variant="!!error ? 'error' : variant || 'bcGov'"
      :placeholder="placeholder"
      :class="{ 'text-red-500': !!error}"
      :disabled="isDisabled"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </UFormGroup>
</template>

<script setup lang="ts">
defineEmits<{(e: 'update:modelValue', value: string): void }>()
defineProps({
  label: { type: [String], default: '' },
  name: { type: String, default: 'email' },
  placeholder: { type: [String], default: '' },
  id: { type: String, required: true },
  modelValue: { type: String, default: '' },
  variant: { type: String, default: 'bcGov' },
  isDisabled: { type: Boolean, default: false }
})
</script>
