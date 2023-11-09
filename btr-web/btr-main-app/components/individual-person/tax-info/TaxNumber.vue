<template>
  <div class="flex flex-col py-5">
    <div class="flex items-center mb-2 py-1">
      <URadio
        id="taxNumberRadioButton"
        v-model="selectedButton"
        :value="`CRA Tax Number`"
        @change="handleRadioButtonChange(`CRA Tax Number`)"
      />
      <UFormGroup :name="name" class="ml-5">
        <UInput
          v-model="taxNumber"
          type="text"
          :disabled="selectedButton !== 'CRA Tax Number'"
          variant="bcGov"
          :placeholder="$t('placeholders.taxNumber')"
          class="w-80"
          @blur="formatInput"
        />
      </UFormGroup>
    </div>
    <div class="flex items-center mb-2 py-2">
      <URadio
        id="noTaxNumberRadioButton"
        v-model="selectedButton"
        :value="`No Tax Number`"
        @change="handleRadioButtonChange(`No Tax Number`)"
      />
      <label class="ml-5"> This person does not have a CRA Tax Number </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from 'vue'

defineProps({
  id: { type: String, required: true },
  name: { type: String, default: 'name' },
  modelValue: {
    type: Object,
    default: () => ({
      hasTaxNumber: false,
      taxNumber: ''
    })
  },
  label: { type: String, default: '' }
})

const emit = defineEmits<{(e: 'update:modelValue', value: { hasTaxNumber: boolean; taxNumber: string }): void}> ()

// Indicate which radio button is selected.
const selectedButton = ref('')

// The tax number input value
const taxNumber = ref('')

// Watch the selected radio button value to update the taxNumber value and emit the parent's `v-model`.
watch(() => selectedButton.value, (button) => {
  if (button === 'No Tax Number') {
    emit('update:modelValue', { hasTaxNumber: false, taxNumber: 'No Tax Number' })
    taxNumber.value = ''
  } else if (taxNumber.value) {
    emit('update:modelValue', { hasTaxNumber: true, taxNumber: taxNumber.value })
  } else {
    emit('update:modelValue', { hasTaxNumber: true, taxNumber: '' })
  }
})

// Watch the taxNumber value to update the parent's `v-model` only if the selected radio button is 'CRA Tax Number'.
watch(() => taxNumber.value, (newTaxNumber) => {
  if (selectedButton.value === 'CRA Tax Number') {
    emit('update:modelValue', { hasTaxNumber: true, taxNumber: newTaxNumber })
  }
})

const handleRadioButtonChange = (value) => {
  selectedButton.value = value
}

const formatInput = () => {
  // const newValue = formatTaxNumber(taxNumber.value)
  const newValue = formatTaxNumber(taxNumber.value)
  taxNumber.value = newValue
  emit('update:modelValue', { hasTaxNumber: true, taxNumber: newValue })
}

/**
 * Format the tax number to "xxx xxx xxx"
 * @param {string} taxNumber - string representation of the tax number input
 */
const formatTaxNumber = (taxNumber: string): string => {
  // if the tax number cannot pass the above validation checks, it will not be formatted
  if (!checkSpecialCharacters(taxNumber) || !checkTaxNumberLength(taxNumber) || !validateTaxNumber(taxNumber)) {
    return taxNumber
  }

  const digits = taxNumber.replace(/\s+/g, '')

  let formattedNumber: string = ''

  for (let i = 0; i < 9; i++) {
    formattedNumber += digits[i]
    if (i === 2 || i === 5) {
      formattedNumber += ' '
    }
  }

  return formattedNumber
}
</script>
