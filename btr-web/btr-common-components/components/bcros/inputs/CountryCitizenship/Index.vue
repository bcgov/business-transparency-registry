<template>
  <URadioGroup
    id="countryOfCitizenship"
    v-model="citizenshipType"
    :options="options"
    as="template"
  >
    <template #label="{ option }">
      <div v-if="option.value==='other'" class="w-full h-14">
        {{ option.label }}
        <br>
        <label>{{ $t('labels.countryOfCitizenship.selectAll') }}</label>
        <br>
        <BcrosInputsCountryCitizenshipDropdown
          v-model="citizenships"
          :disabled="citizenshipType!=='other'"
        />
      </div>
      <div v-else class="w-full h-14">
        {{ option.label }}
      </div>
    </template>
  </URadioGroup>
</template>

<script setup lang="ts">
import { Ref } from 'vue'
import { BtrCountryI } from '~/interfaces/btr-address-i'

const { t } = useI18n()

const citizenshipType = ref('')
const citizenships: Ref<Array<BtrCountryI>> = ref([])

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

<style scoped>
</style>
