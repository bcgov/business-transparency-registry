<template>
  <UInputMenu
    v-model="selectedCountry"
    :options="countryListOptions"
    variant="bcGov"
    option-attribute="label"
    :ui-menu=" { option: { container: 'flex flex-row w-full py-0 m-0' }}"
    class="flex items-center w-full bg-red-400"
  >
    <template #leading>
        <BcrosCountryFlag
          v-if="!!selectedCountry?.countryCode2letterIso"
          :tooltipText="selectedCountry?.countryNameLocal"
          :countryCodeIso2letter="selectedCountry?.countryCode2letterIso"
        />
    </template>

    <template #option="{ option: optionItem }">
      <BcrosCountryFlag
        :tooltipText="optionItem.countryNameLocal"
        :countryCodeIso2letter="optionItem.countryCode2letterIso"
      />
      <span class="truncate h-5">{{ optionItem.label }}</span>
    </template>
  </UInputMenu>
</template>

<script setup lang="ts">
import countryList from 'country-codes-list'
import BcrosCountryFlag from '~/components/bcros/CountryFlag.vue'

const _countryListOptions =
  countryList.customList('countryCode', '{countryCallingCode},{countryNameEn},{countryNameLocal}')

interface CountryListItemI {
  countryCode2letterIso: string,
  countryCallingCode: string,
  label: string,
  countryNameLocal: string,
  countryNameEn: string
}

const countryListOptions: Array<CountryListItemI> = Object.keys(_countryListOptions).map(key => {
  const [countryCallingCode, countryNameEn, countryNameLocal] = _countryListOptions[key].split(',')
  return {
    countryCode2letterIso: key,
    countryCallingCode: countryCallingCode,
    label: `+${countryCallingCode}`,
    countryNameLocal: countryNameLocal,
    countryNameEn: countryNameEn
  }
}).sort((a, b) => a.countryCallingCode.localeCompare(b.countryCallingCode))

const countryCode = defineModel<string | undefined>('countryCallingCode', { required: false })
const countryCode2letterIso = defineModel<string | undefined>('countryCode2letterIso', { required: false })

const selectedCountry = ref<CountryListItemI | undefined>(undefined)

if (countryCode2letterIso.value !== undefined) {
  selectedCountry.value = countryListOptions.find(item => item.countryCode2letterIso === countryCode2letterIso.value)
} else if (countryCode.value !== undefined) {
  selectedCountry.value = {
    countryCallingCode: `+${countryCode.value}`
  }
}
</script>
