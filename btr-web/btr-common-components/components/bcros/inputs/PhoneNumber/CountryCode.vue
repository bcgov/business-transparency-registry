<template>
  <UInputMenu
    v-model="selectedCountry"
    :options="countryListOptions"
    variant="bcGov"
    size="sm"
    option-attribute="label"
    :ui="{
      icon: {
        leading: {
          padding: {
            sm: 'ps-1.5 pb-2'
          }
        }
      }
    }"
    :padded="false"
    @input="manualInput($event)"
  >
    <template #leading>
      <BcrosCountryFlag
        v-if="!!selectedCountry?.countryCode2letterIso"
        :tooltip-text="selectedCountry?.countryNameLocal"
        :country-code-iso2letter="selectedCountry?.countryCode2letterIso"
      />
    </template>

    <template #option="{ option: optionItem }">
      <BcrosCountryFlag
        :tooltip-text="optionItem.countryNameLocal"
        :country-code-iso2letter="optionItem.countryCode2letterIso"
      />
      <span class="truncate h-5">{{ optionItem.label }}</span>
    </template>
  </UInputMenu>
</template>

<script setup lang="ts">
import countryList from 'country-codes-list'
import BcrosCountryFlag from '~/components/bcros/CountryFlag.vue'
import { CountryListItemI } from '~/interfaces/country-dropdown-i'

const _countryListOptions =
  countryList.customList('countryCode', '{countryCallingCode},{countryNameEn},{countryNameLocal}')

const manualInput = (event) => {
  selectedCountry.value = {
    countryCallingCode: event.target.value
  }
}

const countryListOptions: Array<CountryListItemI> = Object.keys(_countryListOptions).map((key) => {
  const [countryCallingCode, countryNameEn, countryNameLocal] = _countryListOptions[key].split(',')
  return {
    countryCode2letterIso: key,
    countryCallingCode,
    label: `+${countryCallingCode}`,
    countryNameLocal,
    countryNameEn
  }
}).sort((a, b) => a.countryCallingCode.localeCompare(b.countryCallingCode))

const countryCallingCode = defineModel<string | undefined>('countryCallingCode', { required: false })
const countryCode2letterIso = defineModel<string | undefined>('countryCode2letterIso', { required: false })

const selectedCountry = ref<CountryListItemI | undefined>(undefined)

if (countryCode2letterIso.value !== undefined) {
  selectedCountry.value = countryListOptions.find(item => item.countryCode2letterIso === countryCode2letterIso.value)
} else if (countryCallingCode.value !== undefined) {
  selectedCountry.value = {
    countryCallingCode: `+${countryCallingCode.value}`
  }
}

watch(
  selectedCountry,
  (newVal) => {
    if (newVal?.countryCallingCode !== countryCallingCode.value) {
      countryCallingCode.value = newVal?.countryCallingCode
    }
    if (newVal?.countryCode2letterIso !== countryCode2letterIso.value) {
      countryCode2letterIso.value = newVal?.countryCode2letterIso
    }
  }
)

</script>
