<template>
  <UFormGroup :label="label" name="taxNumber" class="flex flex-col">
    <p>
      A Social Insurance Number (SIN), an Individual Tax Number (ITN), or a Temporary
      Taxation Number (TTN) is required if this person has one.
    </p>
    <div v-for="(option, index) in options" :key="index" class="flex items-center mb-2">
      <URadio
        :id="`${id}-${option.value}`"
        v-model="selectedButton"
        name="taxNumber"
        :value="option.value"
        @change="handleRadioButtonChange(option.value)"
      />
      <UInput
        v-if="option.value === 'CRA Tax Number'"
        v-model="taxNumber"
        type="text"
        :disabled="selectedButton !== 'CRA Tax Number'"
        variant="bcGov"
        :placeholder="option.placeholder"
        class="ml-2 w-80"
        @blur="formatInput"
      />
      <label v-else :for="`${id}-${option.value}`" class="ml-2">{{ option.label }}</label>
    </div>
  </UFormGroup>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from 'vue'
import { formatTaxNumber } from '~/utils/validation/form_inputs'

const props = defineProps({
  id: { type: String, required: true },
  modelValue: { type: String, default: '' },
  label: { type: String, default: '' }
})

const emit = defineEmits<{(e: 'update:modelValue', value: string): void }>()

// Indicate which radio button is selected.
const selectedButton = ref('')

// The tax number input value
const taxNumber = ref('')

const options = [
  { value: 'CRA Tax Number', label: '', placeholder: 'CRA Tax Number (SIN, ITN, or TTN)' },
  { value: 'No Tax Number', label: 'This person does not have a CRA Tax Number' }
]

// Watch the selected radio button value to update the taxNumber value and emit the parent's `v-model`.
watch(() => selectedButton.value, (button) => {
  if (button === 'No Tax Number') {
    emit('update:modelValue', 'No Tax Number')
    taxNumber.value = ''
  } else if (taxNumber.value) {
    emit('update:modelValue', taxNumber.value)
  } else {
    emit('update:modelValue', '')
  }
})

// Watch the taxNumber value to update the parent's `v-model` only if the selected radio button is 'CRA Tax Number'.
watch(() => taxNumber.value, (newTaxNumber) => {
  if (selectedButton.value === 'CRA Tax Number') {
    emit('update:modelValue', newTaxNumber)
  }
})

const handleRadioButtonChange = (value) => {
  selectedButton.value = value
}

const formatInput = () => {
  const newValue = formatTaxNumber(props.modelValue)
  taxNumber.value = newValue
  emit('update:modelValue', newValue)
}
</script>
