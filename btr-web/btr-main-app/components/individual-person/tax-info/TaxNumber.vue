<template>
  <div class="flex flex-col py-5">
    <UFormGroup v-slot="{ error }" :name="name + '.hasTaxNumber'">
      <div class="flex flex-row mb-2 py-1">
        <UFormGroup name="doNothingJustWatch">
          <URadio
            id="taxNumberRadioButton4"
            v-model="hasTaxNumber"
            class="mt-3"
            :value="true"
            :aria-label="$t('placeholders.taxNumber')"
          />
        </UFormGroup>
        <UFormGroup
          ref="taxNumberInputGroupRef"
          v-slot="{ error }"
          :name="name+'.taxNumber'"
          class="ml-5"
        >
          <UInput
            v-model="taxNumber"
            data-cy="tax-number-input"
            type="text"
            :variant="error ? 'error' : variant"
            :placeholder="$t('placeholders.taxNumber')"
            class="w-80"
            @focusout="formatInput"
            @focus="hasTaxNumber = true"
          />
        </UFormGroup>
      </div>

      <div class="flex flex-row items-center mb-2 py-2">
        <URadio
          id="noTaxNumberRadioButton"
          v-model="hasTaxNumber"
          :value="false"
          :variant="error ? 'error' : variant"
          @change="taxNumber = null"
        />
        <label for="noTaxNumberRadioButton" class="ml-5" :class="{ 'text-red-500': error}">
          {{ $t('labels.noTaxNumberLabel') }}
        </label>
      </div>
    </UFormGroup>
  </div>
</template>

<script setup lang="ts">
const hasTaxNumber = defineModel('hasTaxNumber', { required: false, default: null })
const taxNumber = defineModel('taxNumber', { required: false, default: null })

const emit = defineEmits<{
  (e: 'clearTaxNumber', errorPath: string): void
}>()

const props = defineProps<{
  name: String
  variant: String
}>()

const taxNumberInputGroupRef = ref() // UFormGroup ref
const formatInput = () => {
  taxNumber.value = formatTaxNumber(taxNumber.value)
}

/**
 * Format the tax number to "xxx xxx xxx"
 * @param {string} taxNumber - string representation of the tax number input
 */
const formatTaxNumber = (taxNumber: string | null): string | null => {
  if (taxNumber === null) {
    return null
  }
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
