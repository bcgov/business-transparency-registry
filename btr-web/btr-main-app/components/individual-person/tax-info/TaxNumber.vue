<template>
  <div class="flex flex-col py-5">
    <div class="flex mb-2 py-1">
      <URadio
        id="taxNumberRadioButton"
        v-model="selectedButton"
        :value="HAS_TAX_NUMBER"
        class="mt-3"
        :aria-label="$t('placeholders.taxNumber')"
        @change="handleRadioButtonChange(HAS_TAX_NUMBER)"
      />
      <UFormGroup :name="name" class="ml-5">
        <UInput
          v-model="taxNumber"
          data-cy="tax-number-input"
          type="text"
          :variant="variant"
          :placeholder="$t('placeholders.taxNumber')"
          class="w-80"
          @blur="formatInput"
          @focus="handleInputFocus"
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
      <label for="noTaxNumberRadioButton" class="ml-5" :class="{ 'text-red-500': hasError}">
        {{ $t('labels.noTaxNumberLabel') }}
      </label>
    </div>
    <div v-if="hasError" class="text-sm text-red-500">
      {{ errors[0].message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormError } from '#ui/types'

const HAS_TAX_NUMBER = 'hasTaxNumber'
const NO_TAX_NUMBER = 'noTaxNumber'

const props = defineProps({
  id: { type: String, required: true },
  name: { type: String, default: 'name' },
  errors: { type: Object as PropType<FormError[]>, required: true },
  hasTaxNumber: { type: [Boolean, undefined], required: false, default: undefined },
  taxNumber: { type: [String, undefined], required: false, default: undefined },
  variant: { type: String, default: 'bcGov' }
})

// eslint-disable-next-line func-call-spacing
const emit = defineEmits<{
  (e: 'update:hasTaxNumber', value: boolean | undefined): void
  (e: 'update:taxNumber', value: string | undefined): void
}>()

const emitUpdates = (hasTaxNumber: boolean | undefined, taxNumber: string | undefined) => {
  emit('update:hasTaxNumber', hasTaxNumber)
  emit('update:taxNumber', taxNumber)
}

// Indicate which radio button is selected.
const selectedButton = ref(
  props.hasTaxNumber === undefined ? '' : (props.hasTaxNumber ? HAS_TAX_NUMBER : NO_TAX_NUMBER)
)

const hasError = computed<Boolean>(() => {
  return props.errors.length > 0
})

// The tax number input value
const taxNumber = ref(props.taxNumber ? props.taxNumber : '')

watch(taxNumber, (newTaxNumber) => {
  // when the user starts typing, the radio HAS_TAX_NUMBER button should be selected
  if (newTaxNumber !== '') {
    selectedButton.value = HAS_TAX_NUMBER
    emitUpdates(true, newTaxNumber)
  }
})

const handleRadioButtonChange = (value) => {
  selectedButton.value = value
  if (value === NO_TAX_NUMBER) {
    taxNumber.value = ''
    emitUpdates(false, undefined)
  } else {
    emitUpdates(true, taxNumber.value)
  }
}

const handleInputFocus = () => {
  if (selectedButton.value !== HAS_TAX_NUMBER) {
    selectedButton.value = HAS_TAX_NUMBER
  }
}

const formatInput = () => {
  // const newValue = formatTaxNumber(taxNumber.value)
  const newValue = formatTaxNumber(taxNumber.value)
  taxNumber.value = newValue
  emitUpdates(true, newValue)
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
