<template>
  <UFormGroup :label="label" :name="name">
    <UInput
      :id="id"
      type="text"
      v-bind="$attrs"
      :value="modelValue"
      variant="bcGov"
      @input="$emit('update:modelValue', $event.target.value)"
      @blur="normalizeInput"
    />
  </UFormGroup>
</template>

<script setup lang="ts">
import { normalizeName } from '~/utils/validation/form_inputs'

const emit = defineEmits<{(e: 'update:modelValue', value: string): void}>()

const props = defineProps({
  label: { type: [String], default: '' },
  id: { type: String, required: true },
  name: { type: String, default: 'name' },
  modelValue: { type: String, default: '' }
})

const normalizeInput = () => {
  const normalizedValue = normalizeName(props.modelValue)
  emit('update:modelValue', normalizedValue)
}
</script>
