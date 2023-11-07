<template>
  <UFormGroup :label="label" name="taxResidency" class="flex flex-col">
    <p>Indicate if this person is a resident of Canada for Income Tax purposes.</p>
    <URadio
      v-for="(option, index) in options"
      :id="`${id}-${option.value}`"
      :key="index"
      v-model="selectedValue"
      name="taxResidency"
      :value="option.value"
      :label="option.label"
      class="flex items-center mb-2"
    />
  </UFormGroup>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue'

const props = defineProps({
  id: { type: String, required: true },
  modelValue: { type: String, default: '' },
  label: { type: String, default: '' }
})

const emit = defineEmits<{(e: 'update:modelValue', value: string): void}>()

const selectedValue = ref(props.modelValue)

const options = [
  { value: 'true', label: 'Canada tax resident' },
  { value: 'false', label: 'Not a Canada tax resident' }
]

watch(selectedValue, (newValue) => {
  emit('update:modelValue', newValue)
})
</script>
