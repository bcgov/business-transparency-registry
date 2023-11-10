<template>
  <div class="flex flex-col py-5">
    <div class="flex items-center mb-2 py-1">
      <URadio
        id="taxNumberRadioButton"
        v-model="selectedButton"
        :value="HAS_TAX_NUMBER"
        @change="handleRadioButtonChange(HAS_TAX_NUMBER)"
      />
      <UFormGroup :name="name" class="ml-5">
        <UInput
          v-model="taxNumber"
          type="text"
          :disabled="selectedButton !== HAS_TAX_NUMBER"
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
        :value="NO_TAX_NUMBER"
        @change="handleRadioButtonChange(NO_TAX_NUMBER)"
      />
      <label class="ml-5"> {{ $t('labels.noTaxNumberLabel') }} </label>
    </div>
  </div>
</template>

<script setup lang="ts">
const HAS_TAX_NUMBER = 'hasTaxNumber'
const NO_TAX_NUMBER = 'noTaxNumber'

defineProps({
  id: { type: String, required: true },
  name: { type: String, default: 'name' },
  modelValue: {
    type: Object,
    default: () => ({
      hasTaxNumber: undefined,
      taxNumber: undefined
    })
  }
})

const emit = defineEmits<{
  'update:modelValue': [value: { hasTaxNumber: boolean; taxNumber: string | undefined }]
}>()

// Indicate which radio button is selected.
const selectedButton = ref('')

// The tax number input value
const taxNumber = ref('')

// Watch the selected radio button value to update the taxNumber value and emit the parent's `v-model`.
watch(() => selectedButton.value, (button) => {
  if (button === NO_TAX_NUMBER) {
    emit('update:modelValue', { hasTaxNumber: false, taxNumber: undefined })
    taxNumber.value = ''
  } else {
    emit('update:modelValue', { hasTaxNumber: true, taxNumber: taxNumber.value })
  }
})

// Watch the taxNumber value to update the parent's `v-model` only if the selected radio button is 'CRA Tax Number'.
watch(() => taxNumber.value, (newTaxNumber) => {
  if (selectedButton.value === HAS_TAX_NUMBER) {
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
