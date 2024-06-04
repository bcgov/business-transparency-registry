<template>
  <UFormGroup
    :name="name"
    :help="help"
    class="flex flex-col"
    data-cy="countryOfCitizenship"
  >
    <BcrosInputsCountriesOfCitizenshipDropdown
      v-model="model"
      class="text-gray-900"
    />
  </UFormGroup>
</template>

<script setup lang="ts">
const model = defineModel({ type: Array<BtrCountryI>, required: true })

defineProps({
  name: { type: String, default: 'countriesOfCitizenship' },
  help: { type: String, default: '' }
})
</script>
