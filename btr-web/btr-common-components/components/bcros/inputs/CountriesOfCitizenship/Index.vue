<template>
  <URadioGroup
    id="countryOfCitizenship"
    v-model="citizenshipType"
    :options="options"
    as="template"
  >
    <template #label="{ option }">
      <div v-if="option.value === 'other'" class="w-full h-14">
        {{ option.label }}
        <br>
        <label>{{ $t('labels.countryOfCitizenship.selectAll') }}</label>
        <br>
        <BcrosInputsCountriesOfCitizenshipDropdown
          v-model="citizenshipsInternal"
          :disabled="citizenshipType !== 'other'"
        />
      </div>
      <div v-else class="w-full h-14">
        {{ option.label }}
      </div>
    </template>
  </URadioGroup>
  <br>
  <br>
  <br>
  ~~~~~~~~~~~~~~~~~~{{ citizenshipType }}~~~~~~~~~~~~~~~~~~~~~
</template>

<script setup lang="ts">

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
  value: 'other',
  label: t('labels.countryOfCitizenship.others')
}]
</script>
