<template>
  <div>
    <div
      class="flex flex-col py-5"
      :class="{ 'text-red-500': hasError}"
      data-cy="countryOfCitizenshipRadioGroup"
    >
      <div v-for="option in options" :key="option.value" class="flex items-center mb-2 py-1">
        <URadio
          :id="`radio-${option.value}`"
          v-model="citizenshipType"
          :value="option.value"
        />
        <label
          :for="`radio-${option.value}`"
          class="text-base ml-5"
          :class="hasError ? 'text-red-500' : 'text-gray-900'"
        >
          {{ option.label }}
        </label>
      </div>
      <div class="ml-9">
        {{ $t('labels.countryOfCitizenship.selectAll') }}
        <BcrosInputsCountriesOfCitizenshipDropdown
          v-model="citizenshipsInternal"
          class="text-gray-900"
          :disabled="citizenshipType !== CitizenshipTypeE.OTHER"
        />
      </div>
    </div>
    <div v-if="hasError" class="text-sm text-red-500">
      {{ errors[0].message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormError } from '#ui/types'

const t = useNuxtApp().$i18n.t
const emit = defineEmits<{
  'update:citizenships': [value: Array<BtrCountryI>]
  'update:canadianCitizenship': [value: string | null]
}>()
const props = defineProps({
  canadianCitizenship: { type: String, default: '' },
  citizenships: { type: Array<BtrCountryI>, required: true },
  errors: { type: Object as PropType<FormError[]>, required: true }
})

const citizenshipType = computed({
  get () {
    return props.canadianCitizenship
  },
  set (value) {
    if (value !== CitizenshipTypeE.OTHER) {
      citizenshipsInternal.value = []
    }
    emit('update:canadianCitizenship', value)
  }
})

const citizenshipsInternal = computed({
  get () {
    return props.citizenships
  },
  set (value) {
    emit('update:citizenships', value)
  }
})

const options = [{
  value: CitizenshipTypeE.CITIZEN,
  label: t('labels.countryOfCitizenship.citizen')
}, {
  value: CitizenshipTypeE.PR,
  label: t('labels.countryOfCitizenship.pr')
}, {
  value: CitizenshipTypeE.OTHER,
  label: t('labels.countryOfCitizenship.others')
}]

const hasError = computed<Boolean>(() => props.errors?.length > 0)
</script>
