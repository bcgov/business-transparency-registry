<template>
  <UFormGroup :label="label" :name="name">
    <template #help>
      {{ help }}
    </template>
    <UInput
      :id="id"
      type="text"
      v-bind="$attrs"
      :value="modelValue"
      :variant="variant"
      :placeholder="placeholder"
      @input="$emit('update:modelValue', $event.target.value)"
      @blur="normalizeInput"
    />
  </UFormGroup>
</template>

<script setup lang="ts">
import { normalizeName } from '~/utils/validation/form_inputs'

const emit = defineEmits<{(e: 'update:modelValue', value: string): void}>()

const props = defineProps({
  label: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  id: { type: String, required: true },
  name: { type: String, default: 'name' },
  modelValue: { type: String, default: '' },
  variant: { type: String, default: 'bcGov' },
  help: { type: String, default: '' }
})

const normalizeInput = () => {
  const normalizedValue = normalizeName(props.modelValue)
  emit('update:modelValue', normalizedValue)
}
</script>
