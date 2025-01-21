<template>
  <UInputMenu
    v-model="selectedCountry"
    v-model:query="query"
    :options="countryListOptions"
    variant="bcGov"
    size="sm"
    :search="search"
    option-attribute="label"
    :ui="{
      icon: {
        leading: {
          padding: {
            sm: 'ps-1.5 pe-1.5 pb-2'
          }
        }
      }
    }"
    padded
    @input="manualInput($event)"
    @blur="onBlur"
  >
    <template v-if="!!selectedCountry?.countryCode2letterIso" #leading>
      <BcrosCountryFlag
        :tooltip-text="selectedCountry?.countryNameLocal"
        :country-code-iso2letter="selectedCountry?.countryCode2letterIso"
        style="z-index: 200"
      />
    </template>

    <template #trailing>
      <UIcon
        v-if="!!selectedCountry"
        name="i-mdi-close"
        data-cy="clearCountryCode"
        @click.prevent="selectedCountry = undefined"
      />
      <UIcon name="i-mdi-chevron-down" data-cy="expandCountryCodeDropdown" />
    </template>

    <template #option="{ option: optionItem }">
      <div
        class="w-full flex items-center gap-1"
        data-cy="countryCodeOption"
        @click.prevent="onSelect(optionItem)"
      >
        <BcrosCountryFlag
          :tooltip-text="optionItem.countryNameLocal"
          :country-code-iso2letter="optionItem.countryCode2letterIso"
        />
        <span class="truncate h-5">{{ optionItem.label }}</span>
      </div>
    </template>
  </UInputMenu>
</template>

<script setup lang="ts">
import countryList from 'country-codes-list'
import { watch } from 'vue'
import BcrosCountryFlag from '~/components/bcros/CountryFlag.vue'
import { CountryListItemI } from '~/interfaces/country-dropdown-i'

const countryCallingCode = defineModel<string | undefined>('countryCallingCode', { required: false })
const countryCode2letterIso = defineModel<string | undefined>('countryCode2letterIso', { required: false })

const selectedCountry = ref<CountryListItemI | undefined>(undefined)
const query = ref('')

const _countryListOptions =
  countryList.customList('countryCode', '{countryCallingCode},{countryNameEn},{countryNameLocal}')

const manualInput = (event: InputEvent) => {
  if ((event.target as HTMLInputElement).value === '') {
    // clear the selected country if the input value is empty
    selectedCountry.value = undefined
  } else {
    const filteredOptions = search((event.target as HTMLInputElement).value)
    if (filteredOptions.length === 0) {
      // clear the selected country if the filtered options are empty (no match)
      selectedCountry.value = undefined
    }
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

const search = (q: string) => countryListOptions.filter((lo) => {
  return lo.countryCallingCode.includes(q) ||
    lo.countryCode2letterIso?.includes(q) ||
    lo.countryNameEn?.includes(q) ||
    lo.countryNameLocal?.includes(q) ||
    lo.label?.includes(q)
})

const onBlur = () => {
  // clear the query input if no country is matched
  if (selectedCountry.value === undefined) {
    query.value = ''
  }
}

const onSelect = (option: CountryListItemI) => {
  if (selectedCountry.value !== undefined &&
    selectedCountry.value.countryCode2letterIso === option.countryCode2letterIso) {
    selectedCountry.value = undefined
  } else {
    selectedCountry.value = option
    query.value = ''
  }
}

const selectCountry = (countryCode2letterIso: string) => {
  selectedCountry.value = countryListOptions.find(item => item.countryCode2letterIso === countryCode2letterIso)
}

if (countryCode2letterIso.value !== undefined) {
  selectCountry(countryCode2letterIso.value)
} else if (countryCallingCode.value !== undefined) {
  selectedCountry.value = {
    countryCallingCode: `+${countryCallingCode.value}`
  }
}

watch(
  selectedCountry,
  (newVal) => {
    if (newVal === undefined) {
      countryCallingCode.value = undefined
      countryCode2letterIso.value = undefined
      return
    }
    if (newVal?.countryCallingCode !== countryCallingCode.value) {
      countryCallingCode.value = newVal?.countryCallingCode
    }
    if (newVal?.countryCode2letterIso !== countryCode2letterIso.value) {
      countryCode2letterIso.value = newVal?.countryCode2letterIso
    }
  }
)

watch(
  () => countryCode2letterIso.value,
  () => {
    if (countryCode2letterIso.value !== undefined) {
      selectCountry(countryCode2letterIso.value)
    }
  }
)
</script>
