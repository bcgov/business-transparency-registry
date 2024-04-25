<template>
  <div>
    <div
      class="flex flex-col py-5"
      data-cy="countryOfCitizenship"
    >
      <BcrosInputsCountriesOfCitizenshipDropdown
        v-model="citizenshipsInternal"
        class="text-gray-900"
        :errors="errors"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormError } from '#ui/types'

const emit = defineEmits<{ 'update:modelValue': [value: Array<BtrCountryI>] }>()
const props = defineProps({
  modelValue: { type: Array<BtrCountryI>, required: true },
  errors: { type: Object as PropType<FormError[]>, required: true }
})

const citizenshipsInternal = computed({
  get () {
    return props.modelValue
  },
  set (selectedCitizenships) {
    emit('update:modelValue', selectedCitizenships)
  }
})
</script>
