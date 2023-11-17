<template>
  <UFormGroup :label="label" name="email">
    <UInput
      :id="id"
      type="text"
      v-bind="$attrs"
      :value="modelValue"
      variant="bcGov"
      :placeholder="label"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </UFormGroup>
</template>

<script setup lang="ts">

defineEmits<{(e: 'update:modelValue', value: string): void}>()
defineProps({
  label: { type: [String], default: '' },
  id: { type: String, required: true },
  modelValue: { type: String, default: '' }
})
</script>
