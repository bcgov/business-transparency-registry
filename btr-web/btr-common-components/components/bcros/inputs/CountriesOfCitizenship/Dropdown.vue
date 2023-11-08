<template>
  <div class="relative w-full" data-cy="countryOfCitizenshipDropdown">
    <Combobox
      v-slot="{ open }"
      v-model="nonCaCitizenships"
      as="div"
      multiple
      :class="[
        'w-full',
        'cursor-default',
        'overflow-hidden',
        'bg-gray-100',
        'text-left',
        'border-b-2',
        'border-gray-500',
        'focus:outline-none',
        'sm:text-sm',
        'h-[46px]']"
      :disabled="disabled"
    >
      <ComboboxButton
        class="w-full h-11 text-left p-3"
        :class="{ 'text-gray-300': disabled }"
        data-cy="countryOfCitizenshipDropdownButton"
      >
        <span v-if="nonCaCitizenships.length === 0" class="w-full text-gray-400 text-thin">
          {{ $t('labels.countryOfCitizenship.placeholder') }}
        </span>
        <span v-else class="align-middle">
          <BcrosChips
            v-for="country in nonCaCitizenships"
            :key="country.alpha_2"
            :label="country.name"
            class="float-left z-20"
            :has-close="true"
            @chipCloseClicked="removeCitizenship(country)"
            data-cy="countryOfCitizenshipDropdownChip"
          />
        </span>
        <UIcon class="float-right text-2xl " name="i-mdi-chevron-down" />
      </ComboboxButton>
      <div v-show="open" class="absolute z-10 w-full">
        <ul>
          <ComboboxInput
            :placeholder="$t('labels.countryOfCitizenship.findCountry')"
            :class="[
              'w-full',
              'focus:outline-none',
              'sm:text-sm',
              'p-3',
              'bg-gray-100',
              'border-b-1'
            ]"
            @change="filterCountries($event.target.value)"
            data-cy="countryOfCitizenshipDropdownFilter"
          />
          <ComboboxOptions
            :class="[
              'relative',
              'max-h-60',
              'w-full',
              'overflow-auto',
              'bg-white',
              'py-1',
              'text-base',
              'shadow-lg',
              'focus:outline-none',
              'sm:text-sm',
              'bg-gray-500',
              'z-10'
            ]"
            as="div"
          >
            <ComboboxOption
              v-for="country in countriesWithoutCa"
              :key="country.alpha_2"
              v-slot="{ active }"
              :value="country"
              as="template"
            >
              <li
                class="cursor-default select-none py-2 pl-10 pr-4"
                :class="{ 'bg-gray-100': active }"
                data-cy="countryOfCitizenshipDropdownOption"
              >
                <span v-if="isInSelected(country)" class="float-right text-outcomes-approved">
                  <UIcon name="i-mdi-check" />
                  {{ $t('labels.countryOfCitizenship.selected') }}
                </span>
                <span v-else class="float-right text-primary">
                  <UIcon name="i-mdi-add" />
                  {{ $t('labels.countryOfCitizenship.select') }}
                </span>
                <span>
                  {{ country.name }}
                </span>
              </li>
            </ComboboxOption>
          </ComboboxOptions>
        </ul>
      </div>
    </Combobox>
  </div>
</template>

<script setup lang="ts">
import { Combobox, ComboboxInput, ComboboxButton, ComboboxOption, ComboboxOptions } from '@headlessui/vue'

import { BtrCountryI } from '~/interfaces/btr-address-i'

const emit = defineEmits<{ 'update:modelValue': [value: Array<BtrCountryI>] }>()
const props = defineProps({
  placeholder: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  modelValue: { type: Array<BtrCountryI>, required: true }
})

const nonCaCitizenships = computed({
  get () {
    return props.modelValue
  },
  set (value) {
    emit('update:modelValue', value)
  }
})

const allCountriesWithoutCa: Array<BtrCountryI> =
        iscCountriesListSortedByName.filter(country => country.alpha_2 !== 'CA')
const countriesWithoutCa = ref(allCountriesWithoutCa)

const removeCitizenship = (country: BtrCountryI) => {
  const index = nonCaCitizenships.value.indexOf(country)
  if (index > -1) {
    nonCaCitizenships.value.splice(index, 1)
  }
}

const filterCountries = (searchText: string) => {
  const text = searchText.toLowerCase()
  if (text) {
    countriesWithoutCa.value =
      allCountriesWithoutCa.filter(
        value => value.name.toLowerCase().includes(text)
      )
  } else {
    countriesWithoutCa.value = allCountriesWithoutCa
  }
}

const isInSelected = (country) => {
  return nonCaCitizenships.value?.findIndex(c => c.alpha_2 === country.alpha_2) !== -1
}

</script>
