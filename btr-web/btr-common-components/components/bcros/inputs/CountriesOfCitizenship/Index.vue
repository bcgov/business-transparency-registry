<template>
  <URadioGroup
    id="countryOfCitizenship"
    v-model="citizenshipType"
    :options="options"
    as="template"
    data-cy="countryOfCitizenshipRadioGroup"
  >
    <template #label="{ option }">
      <div v-if="option.value === VALUE_OTHER" class="w-full h-14">
        {{ option.label }}
        <br>
        <label>{{ $t('labels.countryOfCitizenship.selectAll') }}</label>
        <br>
        <BcrosInputsCountriesOfCitizenshipDropdown
          v-model="citizenshipsInternal"
          :disabled="citizenshipType !== VALUE_OTHER"
        />
      </div>
      <div v-else class="w-full h-14">
        {{ option.label }}
      </div>
    </template>
  </URadioGroup>
</template>

<script setup lang="ts">
const VALUE_OTHER = 'other'

const { t } = useI18n()
const emit = defineEmits<{
  'update:citizenships': [value: Array<BtrCountryI>]
  'update:canadianCitizenship': [value: string | null]
}>()
const props = defineProps({
  canadianCitizenship: { type: String, default: '' },
  citizenships: { type: Array<BtrCountryI>, required: true }
})

const citizenshipType = computed({
  get () {
    return props.canadianCitizenship
  },
  set (value) {
    if (value !== VALUE_OTHER) {
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
  value: 'citizen',
  label: t('labels.countryOfCitizenship.citizen')
}, {
  value: 'pr',
  label: t('labels.countryOfCitizenship.pr')
}, {
  value: VALUE_OTHER,
  label: t('labels.countryOfCitizenship.others')
}]
</script>
