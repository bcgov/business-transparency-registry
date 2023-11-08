<template>
  <URadioGroup
    id="countryOfCitizenship"
    v-model="canadianCitizenship"
    :options="options"
    as="template"
  >
    <template #label="{ option }">
      <div v-if="option.value===CANADIAN_CITIZENSHIP_E.OTHER.value" class="w-full h-14">
        {{ option.label }}
        <br>
        <label>{{ $t('labels.countryOfCitizenship.selectAll') }}</label>
        <br>
        <BcrosInputsCountriesOfCitizenshipDropdown
          v-model="citizenships"
          :disabled="canadianCitizenship !== CANADIAN_CITIZENSHIP_E.OTHER"
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
  ~~~~~~~~~~~~~~~~~~{{ canadianCitizenship }}~~~~~~~~~~~~~~~~~~~~~
</template>

<script setup lang="ts">
import { WritableComputedRef } from 'vue'
import { CANADIAN_CITIZENSHIP_E } from '~/interfaces/canadian-citizenship-e'
import { BtrCountryI } from '~/interfaces/btr-address-i'

const { t } = useI18n()
const emit = defineEmits<{
  'update:modelValue': [value: Array<BtrCountryI>]
  'update:canadianCitizenship': [value: CANADIAN_CITIZENSHIP_E | null]
}>()
const props = defineProps({
  canadianCitizenship: { type: CANADIAN_CITIZENSHIP_E | null, default: '' },
  modelValue: { type: Array<BtrCountryI>, required: true }
})

const canadianCitizenship: WritableComputedRef<CANADIAN_CITIZENSHIP_E | null> = computed({
  get () {
    return props.canadianCitizenship
  },
  set (value: CANADIAN_CITIZENSHIP_E | null) {
    emit('update:canadianCitizenship', value)
  }
})
const citizenships = computed({
  get () {
    return props.modelValue
  },
  set (value) {
    emit('update:modelValue', value)
  }
})

const options = [{
  value: CANADIAN_CITIZENSHIP_E.CITIZEN,
  label: t('labels.countryOfCitizenship.citizen')
}, {
  value: CANADIAN_CITIZENSHIP_E.PERMANENT_RESIDENT,
  label: t('labels.countryOfCitizenship.pr')
}, {
  value: CANADIAN_CITIZENSHIP_E.OTHER,
  label: t('labels.countryOfCitizenship.others')
}]
</script>
