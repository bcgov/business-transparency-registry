<template>
  <UFormGroup :label="label" name="fullName">
    <UInput
      :id="id"
      type="text"
      v-bind="$attrs"
      :value="modelValue"
      color="gray"
      class="border-b-[2px] bg-gray-100"
      variant="none"
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
  modelValue: { type: String, default: '' }
})

const normalizeInput = () => {
  const normalizedValue = normalizeName(props.modelValue)
  emit('update:modelValue', normalizedValue)
}
</script>
