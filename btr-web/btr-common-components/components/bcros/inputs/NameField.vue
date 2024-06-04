<template>
  <UFormGroup v-slot="{ error }" :label="label" :name="name" :help="help">
    <UInput
      :id="id"
      type="text"
      v-bind="$attrs"
      :value="model"
      :variant="error ? 'error' : variant"
      :placeholder="placeholder"
      :disabled="isDisabled"
      @input="$emit('update:modelValue', $event.target.value)"
      @blur="normalizeInput"
    />
  </UFormGroup>
</template>

<script setup lang="ts">
import { type UseEventBusReturn } from '@vueuse/core'
import { normalizeName } from '~/utils/validation/form_inputs'

const formBus = inject<UseEventBusReturn<any, string> | undefined>('form-events', undefined)

const model = defineModel({ type: String, default: '' })
const emit = defineEmits<{(e: 'update:modelValue', value: string): void}>()

const props = defineProps({
  label: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  id: { type: String, required: true },
  name: { type: String, default: 'name.fullName' },
  variant: { type: String, default: 'bcGov' },
  help: { type: String, default: '' },
  isDisabled: { type: Boolean, default: false }
})

watch(model, () => {
  if (formBus) {
    formBus.emit({ type: 'blur', path: props.name })
    formBus.emit({ type: 'change', path: props.name })
  }
}, { deep: true })

const normalizeInput = () => {
  const normalizedValue = normalizeName(model.value)
  emit('update:modelValue', normalizedValue)
}
</script>
