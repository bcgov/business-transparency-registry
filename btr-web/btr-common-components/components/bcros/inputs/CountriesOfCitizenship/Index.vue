<template>
  <UFormGroup
    v-slot="{ error }"
    :name="name"
    :help="help"
    class="flex flex-col py-5"
    data-cy="countryOfCitizenship"
  >
    <BcrosInputsCountriesOfCitizenshipDropdown
      v-model="citizenshipsInternal"
      class="text-gray-900"
    />
  </UFormGroup>
</template>

<script setup lang="ts">
const emit = defineEmits<{ 'update:modelValue': [value: Array<BtrCountryI>] }>()
const props = defineProps({
  modelValue: { type: Array<BtrCountryI>, required: true },
  name: { type: String, default: 'countriesOfCitizenship' },
  help: { type: String, default: '' },
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
